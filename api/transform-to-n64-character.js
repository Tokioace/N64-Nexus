export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { image, prompt } = req.body

    if (!image) {
      return res.status(400).json({ error: 'Kein Bild bereitgestellt' })
    }

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.log('OpenAI API key not found, using fallback')
      return res.status(200).json({ 
        success: false, 
        error: 'KI-Service temporär nicht verfügbar. Verwende lokalen Filter.',
        fallback: true
      })
    }

    // Convert base64 to buffer for OpenAI API
    const imageBuffer = Buffer.from(image, 'base64')
    
    // Create form data for OpenAI API
    const formData = new FormData()
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    formData.append('image', blob, 'input.jpg')
    formData.append('model', 'dall-e-2')
    formData.append('prompt', prompt || `Transform this person's face into a Nintendo 64 era cartoon character while preserving their facial features. The style should be:
    - Anime/cartoon-like with simplified but recognizable features
    - Low-poly 3D aesthetic similar to N64 games like Mario 64, Zelda OoT, or GoldenEye
    - Bright, saturated colors typical of N64 games
    - Simplified shading and lighting
    - Maintain the person's distinctive facial features (eye shape, nose, mouth, face structure)
    - Clean, stylized look without realistic textures
    - Square/angular features typical of early 3D character models
    - Retro gaming aesthetic from the late 1990s
    The result should look like a character that could appear in a Nintendo 64 game while still being recognizable as the original person.`)
    formData.append('n', '1')
    formData.append('size', '512x512')
    formData.append('response_format', 'url')

    // Call OpenAI API for image variation/edit
    const openaiResponse = await fetch('https://api.openai.com/v1/images/variations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API Error:', errorData)
      
      // Try alternative approach with image generation
      const generationResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Create a Nintendo 64 era cartoon character portrait in the style of classic N64 games. The character should have:
          - Anime/cartoon-like features with simplified but expressive design
          - Low-poly 3D aesthetic similar to Mario 64, Zelda OoT, or GoldenEye characters
          - Bright, saturated colors typical of N64 games
          - Simplified shading and clean lighting
          - Square/angular features typical of early 3D character models
          - Retro gaming aesthetic from the late 1990s
          - Clean, stylized look without realistic textures
          The result should look like a character that could appear in a Nintendo 64 game with a friendly, approachable appearance.`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url'
        })
      })

      if (!generationResponse.ok) {
        return res.status(200).json({ 
          success: false, 
          error: 'KI-Service temporär nicht verfügbar. Verwende lokalen Filter.',
          fallback: true
        })
      }

      const generationData = await generationResponse.json()
      return res.status(200).json({
        success: true,
        imageUrl: generationData.data[0].url
      })
    }

    const data = await openaiResponse.json()
    
    if (data.data && data.data[0] && data.data[0].url) {
      return res.status(200).json({
        success: true,
        imageUrl: data.data[0].url
      })
    } else {
      return res.status(200).json({ 
        success: false, 
        error: 'Unerwartete Antwort von der KI. Verwende lokalen Filter.',
        fallback: true
      })
    }

  } catch (error) {
    console.error('API Error:', error)
    return res.status(200).json({ 
      success: false, 
      error: 'Fehler bei der KI-Verarbeitung. Verwende lokalen Filter.',
      fallback: true
    })
  }
}
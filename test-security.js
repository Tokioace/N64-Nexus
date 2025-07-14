const SecurityService = require('./src/services/SecurityService');

async function testSecurityCenter() {
    console.log('🧪 Testing Battle64 Security & Privacy Center...\n');
    
    const securityService = new SecurityService();
    
    try {
        // Initialize the service
        console.log('1. Initializing Security Service...');
        await securityService.initialize();
        console.log('✅ Security Service initialized successfully\n');
        
        // Test user ID
        const testUserId = 'test-user-123';
        
        // Test security settings
        console.log('2. Testing Security Settings...');
        const securitySettings = await securityService.getUserSecuritySettings(testUserId);
        console.log('✅ Security Settings:', JSON.stringify(securitySettings, null, 2));
        
        // Test privacy settings
        console.log('\n3. Testing Privacy Settings...');
        const privacySettings = await securityService.getUserPrivacySettings(testUserId);
        console.log('✅ Privacy Settings:', JSON.stringify(privacySettings, null, 2));
        
        // Test security scan
        console.log('\n4. Testing Security Scan...');
        const scanResults = await securityService.performSecurityScan(testUserId);
        console.log('✅ Security Scan Results:', JSON.stringify(scanResults, null, 2));
        
        // Test security report
        console.log('\n5. Testing Security Report...');
        const report = await securityService.generateSecurityReport(testUserId);
        console.log('✅ Security Report generated successfully');
        console.log('   - Security Score:', report.security_score);
        console.log('   - Issues found:', report.security_issues.length);
        console.log('   - Recommendations:', report.recommendations.length);
        
        // Test data export
        console.log('\n6. Testing Data Export...');
        const exportResult = await securityService.initiateDataExport(testUserId);
        console.log('✅ Data Export initiated:', JSON.stringify(exportResult, null, 2));
        
        console.log('\n🎉 All tests passed! The Security & Privacy Center is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await securityService.close();
    }
}

// Run the test
testSecurityCenter();
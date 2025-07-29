#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function syncComponents() {
    const sourceDir = path.join(__dirname, '../../../react/radix-ui/src/components/ui');
    const targetDir = path.join(__dirname, '../components');

    try {
        // Ensure target directory exists
        await fs.ensureDir(targetDir);

        // Clear existing components
        await fs.emptyDir(targetDir);

        // Copy all .tsx files
        const files = await fs.readdir(sourceDir);

        for (const file of files) {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                const sourcePath = path.join(sourceDir, file);
                const targetPath = path.join(targetDir, file);

                await fs.copy(sourcePath, targetPath);
                console.log(`✅ Copied ${file}`);
            }
        }

        console.log('🎉 Components synced successfully!');
    } catch (error) {
        console.error('❌ Failed to sync components:', error);
        process.exit(1);
    }
}

syncComponents();
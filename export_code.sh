#!/bin/bash

# ONLYWORKS PROJECT - CODE EXPORT SCRIPT
# Exports all relevant source code to all_code.txt

OUTPUT_FILE="all_code.txt"

echo "ONLYWORKS PROJECT - COMPLETE CODEBASE DUMP" > $OUTPUT_FILE
echo "=============================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "Generated on: $(date)" >> $OUTPUT_FILE
echo "Excludes: node_modules, .claude, .next, .git directories" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to add file content
add_file() {
    local file=$1
    echo "" >> $OUTPUT_FILE
    echo "================================================================================" >> $OUTPUT_FILE
    echo "FILE: $file" >> $OUTPUT_FILE
    echo "================================================================================" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
    cat "$file" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
}

# Export main config files
add_file "./package.json"
add_file "./next.config.js"
add_file "./tailwind.config.ts"
add_file "./postcss.config.js"

# Export app directory
find ./app -name "*.tsx" -o -name "*.ts" -o -name "*.css" | sort | while read file; do
    add_file "$file"
done

# Export components directory
find ./components -name "*.tsx" -o -name "*.ts" | sort | while read file; do
    add_file "$file"
done

# Export lib directory
find ./lib -name "*.tsx" -o -name "*.ts" | sort | while read file; do
    add_file "$file"
done

echo "Code export completed successfully to $OUTPUT_FILE"
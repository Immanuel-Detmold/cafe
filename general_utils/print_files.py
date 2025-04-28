#!/usr/bin/env python3
"""
Script to print code files with sensitive information masked.
Useful for copying code context to AI tools while protecting sensitive data.
Output is automatically copied to clipboard.
"""

import os
import argparse
import sys
import json
import re
from io import StringIO

# File extensions to consider as code files
CODE_EXTENSIONS = {
    '.py', '.js', '.ts', '.html', '.css', '.java', '.c', '.cpp', '.h', 
    '.hpp', '.cs', '.go', '.rs', '.rb', '.php', '.pl', '.sh', '.json', 
    '.xml', '.md', '.ini', '.conf', '.txt', '.exp'
}

# Files to exclude
EXCLUDE_DIRS = {'.git', '__pycache__', 'node_modules', 'venv', '.venv', 'env', '.env', 'build', 'dist', "tests"}

# Keys that contain sensitive information to mask
SENSITIVE_KEYS = {
    'password', 'secret', 'key', 'token', 'api_key', 'apikey', 'api-key', 
    'auth', 'credential', 'pass', 'realm_id', 'customer_portal_user', 
    'customer_portal_password'
}

def is_code_file(file_path):
    """Check if a file is a code file based on its extension."""
    _, ext = os.path.splitext(file_path)
    return ext.lower() in CODE_EXTENSIONS

def is_json_file(file_path):
    """Check if a file is a JSON file based on its extension."""
    _, ext = os.path.splitext(file_path)
    return ext.lower() == '.json'

def is_env_file(file_path):
    """Check if a file is an environment file (.env or .env.local)."""
    base_name = os.path.basename(file_path)
    return base_name == '.env' or base_name.startswith('.env.')

def mask_sensitive_data(content, file_path):
    """Mask sensitive data in the content."""
    if is_env_file(file_path):
        return mask_env_file(content)
    elif is_json_file(file_path):
        try:
            # Parse JSON
            json_data = json.loads(content)
            # Mask sensitive data
            json_data = mask_json_recursive(json_data)
            # Convert back to formatted JSON
            return json.dumps(json_data, indent=2)
        except json.JSONDecodeError:
            # If not valid JSON, try to mask with regex
            return mask_with_regex(content)
    return mask_with_regex(content)

def mask_env_file(content):
    """Mask all environment variables in .env files."""
    masked_lines = []
    
    for line in content.split('\n'):
        line = line.strip()
        
        # Skip comments and empty lines
        if not line or line.startswith('#'):
            masked_lines.append(line)
            continue
            
        # Handle export prefix in some .env files
        export_prefix = ''
        if line.startswith('export '):
            export_prefix = 'export '
            line = line[7:]
            
        # Find the key-value separator (= or :)
        key_value_separator = '='
        if '=' in line:
            key, value = line.split('=', 1)
        elif ':' in line:
            key, value = line.split(':', 1)
            key_value_separator = ':'
        else:
            # If no separator, keep the line as is
            masked_lines.append(line)
            continue
            
        key = key.strip()
        
        # Determine what type of value to mask it as
        if any(sensitive_key in key.lower() for sensitive_key in SENSITIVE_KEYS):
            if 'password' in key.lower():
                masked_value = "masked_password"
            elif 'user' in key.lower() or 'email' in key.lower():
                masked_value = "masked_user@example.com"
            elif 'id' in key.lower():
                masked_value = "masked_id"
            else:
                masked_value = "masked_value"
        else:
            # Mask all environment variables regardless of key name
            masked_value = "masked_env_value"
            
        # Reconstruct the line with masked value
        masked_lines.append(f"{export_prefix}{key}{key_value_separator}{masked_value}")
        
    return '\n'.join(masked_lines)

def mask_json_recursive(data):
    """Recursively mask sensitive data in JSON structure."""
    if isinstance(data, dict):
        for key, value in list(data.items()):
            # Check if the key contains any sensitive keyword
            if any(sensitive_key in key.lower() for sensitive_key in SENSITIVE_KEYS):
                if isinstance(value, str):
                    if 'password' in key.lower():
                        data[key] = "masked_password"
                    elif 'user' in key.lower() or 'email' in key.lower():
                        data[key] = "masked_user@example.com"
                    elif 'id' in key.lower():
                        data[key] = "masked_id"
                    else:
                        data[key] = "masked_value"
            else:
                # Recursively check nested structures
                data[key] = mask_json_recursive(value)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            data[i] = mask_json_recursive(item)
    return data

def mask_with_regex(content):
    """Use regex to mask potentially sensitive data."""
    # Mask passwords in various formats
    content = re.sub(r'("password"\s*:\s*)"[^"]*"', r'\1"masked_password"', content)
    content = re.sub(r'("pass"\s*:\s*)"[^"]*"', r'\1"masked_password"', content)
    content = re.sub(r'(password\s*=\s*)[^\s,;]+', r'\1masked_password', content)
    
    # Mask API keys and tokens
    content = re.sub(r'("api[_-]?key"\s*:\s*)"[^"]*"', r'\1"masked_api_key"', content)
    content = re.sub(r'("token"\s*:\s*)"[^"]*"', r'\1"masked_token"', content)
    
    # Mask realm IDs
    content = re.sub(r'("realm_id"\s*:\s*)"[^"]*"', r'\1"masked_id"', content)
    
    # Mask customer portal credentials
    content = re.sub(r'("customer_portal_user"\s*:\s*)"[^"]*"', r'\1"masked_user@example.com"', content)
    content = re.sub(r'("customer_portal_password"\s*:\s*)"[^"]*"', r'\1"masked_password"', content)
    
    # Mask environment variables in format KEY=value or KEY: value
    content = re.sub(r'^([A-Za-z0-9_]+)(\s*=\s*|\s*:\s*)[^\n]+$', r'\1\2masked_env_value', content, flags=re.MULTILINE)
    
    return content

def print_file_content(file_path, output_buffer):
    """Print file path as header followed by masked file content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Mask sensitive data
        masked_content = mask_sensitive_data(content, file_path)
        
        print(f"\n<source>{file_path}</source>", file=output_buffer)
        print("<document_content>", file=output_buffer)
        print(masked_content, file=output_buffer)
        print("</document_content>", file=output_buffer)
    except UnicodeDecodeError:
        print(f"\n<source>{file_path}</source>", file=output_buffer)
        print("<document_content>", file=output_buffer)
        print("[Binary file - content not displayed]", file=output_buffer)
        print("</document_content>", file=output_buffer)
    except Exception as e:
        print(f"\n<source>{file_path}</source>", file=output_buffer)
        print("<document_content>", file=output_buffer)
        print(f"[Error reading file: {str(e)}]", file=output_buffer)
        print("</document_content>", file=output_buffer)

def copy_to_clipboard(text):
    """Copy text to clipboard based on platform."""
    platform = sys.platform
    
    try:
        if platform == 'win32':
            # Windows
            import win32clipboard
            win32clipboard.OpenClipboard()
            win32clipboard.EmptyClipboard()
            win32clipboard.SetClipboardText(text, win32clipboard.CF_UNICODETEXT)
            win32clipboard.CloseClipboard()
            return True
        elif platform == 'darwin':
            # macOS
            import subprocess
            process = subprocess.Popen(
                ['pbcopy'], 
                stdin=subprocess.PIPE, 
                close_fds=True
            )
            process.communicate(text.encode('utf-8'))
            return True
        else:
            # Linux and other Unix-like systems
            import subprocess
            process = subprocess.Popen(
                ['xclip', '-selection', 'clipboard'], 
                stdin=subprocess.PIPE, 
                close_fds=True
            )
            process.communicate(text.encode('utf-8'))
            return True
    except Exception as e:
        print(f"Warning: Could not copy to clipboard: {str(e)}")
        print("You may need to install additional packages:")
        if platform == 'win32':
            print("  pip install pywin32")
        elif platform == 'linux':
            print("  sudo apt-get install xclip")
        return False

def scan_directory(directory):
    """Scan directory recursively for code files and print their contents with sensitive data masked."""
    # Capture output in a string buffer
    output_buffer = StringIO()
    
    print("<documents>", file=output_buffer)
    file_count = 0
    
    for root, dirs, files in os.walk(directory):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            file_path = os.path.join(root, file)
            # Process both code files (by extension) and environment files
            if is_code_file(file_path) or is_env_file(file_path):
                file_count += 1
                print(f"<document index=\"{file_count}\">", file=output_buffer)
                print_file_content(file_path, output_buffer)
                print("</document>", file=output_buffer)
    
    print("</documents>", file=output_buffer)
    print(f"\n{file_count} files found and printed with sensitive data masked.", file=output_buffer)
    
    # Get the complete output
    complete_output = output_buffer.getvalue()
    
    # Print to console
    print(complete_output)
    
    # Copy to clipboard
    if copy_to_clipboard(complete_output):
        print("\nMasked output has been copied to clipboard.")
    else:
        print("\nCould not copy to clipboard. See warnings above.")

def main():
    parser = argparse.ArgumentParser(description='Print code files with sensitive data masked for AI context sharing')
    parser.add_argument('directory', nargs='?', default='.', 
                        help='Directory to scan (default: current directory)')
    parser.add_argument('--no-clipboard', action='store_true',
                        help='Disable automatic clipboard copy')
    parser.add_argument('--add-sensitive', nargs='+', default=[],
                        help='Add additional sensitive keys to mask')
    args = parser.parse_args()
    
    # Add any additional sensitive keys
    SENSITIVE_KEYS.update(args.add_sensitive)
    
    scan_directory(args.directory)

if __name__ == "__main__":
    main()

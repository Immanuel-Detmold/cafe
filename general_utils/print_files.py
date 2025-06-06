#!/usr/bin/env python3
"""
🔐 Sensitive Data Masker 🔐

Script to scan code files and mask sensitive information.
Useful for sharing code context with AI tools while protecting security.
Output is automatically copied to clipboard.
"""

import os
import argparse
import sys
import json
import re
from io import StringIO
from datetime import datetime

# 📋 File extensions to consider as code files
CODE_EXTENSIONS = {
    '.py', '.js', '.ts', '.html', '.css', '.java', '.c', '.cpp', '.h',
    '.hpp', '.cs', '.go', '.rs', '.rb', '.php', '.pl', '.sh', '.json',
    '.yml', '.yaml', '.xml', '.md', '.ini', '.conf', '.txt', '.exp'
}

# 🚫 Directories to exclude
EXCLUDE_DIRS = {
    '.git', '.idea', '__pycache__', 'node_modules', 'venv', 'env',
    'build', 'dist', '.pytest_cache', '.vscode', "reports"
}

# 🚫 Files to exclude (hardcoded for this project)
EXCLUDE_FILES = {
    # Configuration files that might contain sensitive data
    'credentials.json',
    #'.env',
    #'.env.local',
    '.env.development',
    '.env.production',

    # Database files
    'database.sqlite',
    'db.sqlite3',

    # Log files
    'debug.log',
    'error.log',
    'app.log',

    # Personal notes or sensitive documentation
    'notes.txt',
    'todo.md',
    'passwords.txt',

    # Backup files
    'backup.zip',
    'archive.tar.gz',

    # Large generated files
    'package-lock.json',
    'yarn.lock',

    # Project-specific files to exclude
    'ronny-notes.txt',  # Contains personal information
    'package-lock.json', # Very large file with no sensitive data
    "pnpm-lock.yaml"
}

# 🔑 Keys that contain sensitive information to mask
SENSITIVE_KEYS = {
    'password', 'secret', 'key', 'token', 'api_key', 'apikey', 'api-key',
    'auth', 'credential', 'pass', 'realm_id', 'customer_portal_user',
    'customer_portal_password', 'access_token', 'refresh_token',
    'private_key', 'client_secret', 'encryption_key', 'certificate',
    'api-token', 'api_token'
}


def is_code_file(file_path):
    """💻 Check if a file is a code file based on its extension."""
    _, ext = os.path.splitext(file_path)
    return ext.lower() in CODE_EXTENSIONS


def is_json_file(file_path):
    """📊 Check if a file is a JSON file based on its extension."""
    _, ext = os.path.splitext(file_path)
    return ext.lower() == '.json'


def is_env_file(file_path):
    """🌍 Check if a file is an environment file (.env or .env.*)."""
    base_name = os.path.basename(file_path)
    return base_name == '.env' or base_name.startswith('.env.')


def mask_sensitive_data(content, file_path):
    """🎭 Mask sensitive data in the content."""
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
    """🔒 Mask all environment variables in .env files."""
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
    """🧩 Recursively mask sensitive data in JSON structure."""
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
    """🔧 Use regex to mask potentially sensitive data."""
    # Mask passwords in various formats
    content = re.sub(r'("password"\s*:\s*)"[^"]*"', r'\1"masked_password"', content)
    content = re.sub(r'("pass"\s*:\s*)"[^"]*"', r'\1"masked_password"', content)
    content = re.sub(r'(password\s*=\s*)[^\s,;]+', r'\1masked_password', content)

    # Mask API keys and tokens
    content = re.sub(r'("api[_-]?key"\s*:\s*)"[^"]*"', r'\1"masked_api_key"', content)
    content = re.sub(r'("token"\s*:\s*)"[^"]*"', r'\1"masked_token"', content)

    # Mask credentials and authentication data
    content = re.sub(r'("auth[_-]?token"\s*:\s*)"[^"]*"', r'\1"masked_token"', content)
    content = re.sub(r'("access[_-]?token"\s*:\s*)"[^"]*"', r'\1"masked_token"', content)
    content = re.sub(r'("refresh[_-]?token"\s*:\s*)"[^"]*"', r'\1"masked_token"', content)
    content = re.sub(r'("client[_-]?secret"\s*:\s*)"[^"]*"', r'\1"masked_secret"', content)

    # Mask realm IDs
    content = re.sub(r'("realm_id"\s*:\s*)"[^"]*"', r'\1"masked_id"', content)

    # Mask customer portal credentials
    content = re.sub(r'("customer_portal_user"\s*:\s*)"[^"]*"', r'\1"masked_user@example.com"', content)
    content = re.sub(r'("customer_portal_password"\s*:\s*)"[^"]*"', r'\1"masked_password"', content)

    # Mask environment variables in format KEY=value or KEY: value
    content = re.sub(r'^([A-Za-z0-9_]+)(\s*=\s*|\s*:\s*)[^\n]+$', r'\1\2masked_env_value', content, flags=re.MULTILINE)

    return content


def print_file_content(file_path, output_buffer):
    """📄 Print file path as header followed by masked file content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Mask sensitive data
        masked_content = mask_sensitive_data(content, file_path)

        print(f"\n<source>{file_path}</source>", file=output_buffer)
        print("<document_content>", file=output_buffer)
        print(masked_content, file=output_buffer)
        print("</document_content>", file=output_buffer)
        return True
    except UnicodeDecodeError:
        print(f"\n<source>{file_path}</source>", file=output_buffer)
        print("<document_content>", file=output_buffer)
        print("[Binary file - content not displayed]", file=output_buffer)
        print("</document_content>", file=output_buffer)
        return True
    except Exception as e:
        print(f"\n<source>{file_path}</source>", file=output_buffer)
        print("<document_content>", file=output_buffer)
        print(f"[Error reading file: {str(e)}]", file=output_buffer)
        print("</document_content>", file=output_buffer)
        return False


def copy_to_clipboard(text):
    """📋 Copy text to clipboard based on platform."""
    platform = sys.platform

    try:
        if platform == 'win32':
            # Windows
            try:
                import win32clipboard
                win32clipboard.OpenClipboard()
                win32clipboard.EmptyClipboard()
                win32clipboard.SetClipboardText(text, win32clipboard.CF_UNICODETEXT)
                win32clipboard.CloseClipboard()
                return True
            except ImportError:
                print("Warning: win32clipboard module not found. Install with: pip install pywin32")
                return False
        elif platform == 'darwin':
            # macOS
            import subprocess
            process = subprocess.Popen(
                ['pbcopy'],
                stdin=subprocess.PIPE,
                close_fds=True
            )
            process.communicate(text.encode('utf-8'))
            return process.returncode == 0
        else:
            # Linux and other Unix-like systems
            import subprocess
            process = subprocess.Popen(
                ['xclip', '-selection', 'clipboard'],
                stdin=subprocess.PIPE,
                close_fds=True
            )
            process.communicate(text.encode('utf-8'))
            return process.returncode == 0
    except Exception as e:
        print(f"Warning: Could not copy to clipboard: {str(e)}")
        print("You may need to install additional packages:")
        if platform == 'win32':
            print("  pip install pywin32")
        elif platform == 'linux':
            print("  sudo apt-get install xclip")
        return False


def should_exclude_path(path):
    """🚫 Check if a path should be excluded."""
    # Check filename for exact matches
    filename = os.path.basename(path)
    if filename in EXCLUDE_FILES:
        return True

    # Check directory parts
    parts = path.split(os.sep)
    for part in parts:
        if part in EXCLUDE_DIRS:
            return True

    # Also exclude hidden directories and files (starting with .)
    for part in parts:
        if part.startswith('.') and part not in ['.env', '.env.local', '.env.development', '.env.production']:
            return True

    return False


def scan_directory(directory, max_files=None):
    """🔍 Scan directory recursively for code files and print their contents with sensitive data masked."""
    # Capture output in a string buffer
    output_buffer = StringIO()

    # Timestamp for the scan
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print(f"<documents>", file=output_buffer)

    file_count = 0
    processed_files = 0
    error_count = 0
    excluded_files = 0

    # Walk through directory recursively
    for root, dirs, files in os.walk(directory):
        # Skip excluded directories (modify dirs in-place to skip walking into them)
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]

        # Process each file
        for file in files:
            file_path = os.path.join(root, file)

            # Skip excluded paths
            if should_exclude_path(file_path):
                excluded_files += 1
                continue

            # Process code files and environment files
            if is_code_file(file_path) or is_env_file(file_path):
                file_count += 1

                # Print status every 10 files
                if file_count % 10 == 0:
                    sys.stdout.write(f"\rProcessing files: {file_count}...")
                    sys.stdout.flush()

                # If max_files is set and we've reached it, break
                if max_files and file_count > max_files:
                    break

                print(f"<document index=\"{file_count}\">", file=output_buffer)
                success = print_file_content(file_path, output_buffer)
                print("</document>", file=output_buffer)

                if success:
                    processed_files += 1
                else:
                    error_count += 1

        # If max_files is set and we've reached it, break
        if max_files and file_count >= max_files:
            break

    print("</documents>", file=output_buffer)

    # Add summary statistics
    print(f"\n{file_count} files found, {processed_files} processed, {error_count} errors, {excluded_files} excluded. Masked data on {timestamp}.",
          file=output_buffer)

    # Get the complete output
    complete_output = output_buffer.getvalue()

    # Print completion message
    sys.stdout.write(
        f"\rCompleted! Found {file_count} files, processed {processed_files}, encountered {error_count} errors, excluded {excluded_files} files.\n")

    # Print summary to console
    print(f"\nScan Summary:")
    print(f"- Directory: {os.path.abspath(directory)}")
    print(f"- Files found: {file_count}")
    print(f"- Files processed: {processed_files}")
    print(f"- Files excluded: {excluded_files}")
    print(f"- Errors: {error_count}")
    print(f"- Timestamp: {timestamp}")

    return complete_output


def save_to_file(content, filename="masked_output.txt"):
    """💾 Save content to a file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\nOutput saved to {os.path.abspath(filename)}")
        return True
    except Exception as e:
        print(f"\nError saving to file: {str(e)}")
        return False


def main():
    """🚀 Main function."""
    # No need for command line argument parsing for file exclusion since we've hardcoded it
    parser = argparse.ArgumentParser(
        description='SensitiveDataMasker: Mask sensitive data in code files for sharing',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 mask_data.py                  # Scan current directory
  python3 mask_data.py ~/projects/myapp # Scan specific directory
  python3 mask_data.py --save output.txt # Save output to file
  python3 mask_data.py --max-files 100   # Limit scan to 100 files
  python3 mask_data.py --add-sensitive db_password api_secret # Add custom sensitive keys
"""
    )
    parser.add_argument('directory', nargs='?', default='.',
                        help='Directory to scan (default: current directory)')
    parser.add_argument('--no-clipboard', action='store_true',
                        help='Disable automatic clipboard copy')
    parser.add_argument('--save', metavar='FILENAME',
                        help='Save output to specified file')
    parser.add_argument('--add-sensitive', nargs='+', default=[],
                        help='Add additional sensitive keys to mask')
    parser.add_argument('--max-files', type=int, default=None,
                        help='Maximum number of files to process')
    args = parser.parse_args()

    print("🔒 SensitiveDataMasker - Starting scan...")

    # Add any additional sensitive keys
    global SENSITIVE_KEYS
    SENSITIVE_KEYS.update(args.add_sensitive)

    # Print out the files that will be excluded
    if EXCLUDE_FILES:
        print(f"🚫 Files excluded from scanning: {', '.join(list(EXCLUDE_FILES)[:5])}... and {len(EXCLUDE_FILES)-5} more")

    # Start the scan
    directory = os.path.dirname(os.path.dirname(__file__))
    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory")
        return 1

    print(f"Scanning directory: {os.path.abspath(directory)}")
    if args.max_files:
        print(f"Limiting scan to {args.max_files} files")

    complete_output = scan_directory(directory, args.max_files)

    # Save to file if requested
    if args.save:
        save_to_file(complete_output, args.save)

    # Copy to clipboard unless disabled
    if not args.no_clipboard:
        if copy_to_clipboard(complete_output):
            print("\n✅ Masked output has been copied to clipboard.")
        else:
            print("\n❌ Could not copy to clipboard. See warnings above.")
            print("Output is still available in memory and can be saved with --save option.")

    print("\n🎉 Process completed successfully!")
    return 0


if __name__ == "__main__":
    sys.exit(main())

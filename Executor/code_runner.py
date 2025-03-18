import docker
import tempfile
import os
from typing import Dict, Any

class CodeRunner:
    def __init__(self):
        self.client = docker.from_env()
        self.language_configs = {
            'python': {
                'image': 'python:3.9-slim',
                'command': ['python', '/code/solution.py'],
                'file_ext': '.py'
            },
            'java': {
                'image': 'openjdk:11-jdk-slim',
                'command': ['java', 'Solution'],
                'file_ext': '.java'
            },
            'cpp': {
                'image': 'gcc:latest',
                'command': ['/code/solution'],
                'file_ext': '.cpp'
            },
            'go': {
                'image': 'golang:1.16-alpine',
                'command': ['/code/solution'],
                'file_ext': '.go'
            },
            'rust': {
                'image': 'rust:1.53',
                'command': ['/code/solution'],
                'file_ext': '.rs'
            }
        }

    def run(self, code: str, language: str, test_cases: list) -> Dict[str, Any]:
        if language not in self.language_configs:
            raise ValueError(f"Unsupported language: {language}")

        config = self.language_configs[language]
        
        with tempfile.TemporaryDirectory() as tmpdir:
            # Write code to file
            file_path = os.path.join(tmpdir, f"solution{config['file_ext']}")
            with open(file_path, 'w') as f:
                f.write(code)

            # Run tests in container
            container = self.client.containers.run(
                image=config['image'],
                command=config['command'],
                volumes={tmpdir: {'bind': '/code', 'mode': 'ro'}},
                mem_limit='256m',
                nano_cpus=int(0.5 * 1e9),  # 0.5 CPU
                network_disabled=True,
                detach=True
            )

            try:
                container.wait(timeout=30)
                logs = container.logs().decode('utf-8')
                
                return {
                    'success': container.wait()['StatusCode'] == 0,
                    'output': logs,
                    'runtime': container.attrs['State']['StartedAt'],
                    'memory': container.attrs['HostConfig']['Memory']
                }
            finally:
                container.remove(force=True) 
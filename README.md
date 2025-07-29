This repo consists of all the necessary files required to run the EliteCode project
This repo is divided into three main folders
```
.
├── dockerfiles
├── Problems
└── test_runner
```
The dockefiles folder consists of four docker files for C++, Python, Go and Java
```
.
├── cpp.Dockerfile
├── go.Dockerfile
├── java.Dockerfile
└── python.Dockerfile
```
The test_runner folder consists of four test_runner files for C++, Python, Go and Java
```
.
├── test_runner.cpp
├── test_runner.go
├── test_runner.java
└── test_runner.py
```
A test_runner is that file that parses the test.json file, the user submitted source code and verifies whether the output is correct or not
And the rest are problem folder each representing the problem<num> where the num represents the problem_id
Each problem has starter code for C++, Python, Go and Java and a json file named in the format problem<problem_id>_testcases.json
```
.
├── Problems1
├── Problems10
├── Problems2
├── Problems3
├── Problems4
├── Problems5
├── Problems6
├── Problems7
├── Problems8
└── Problems9
```

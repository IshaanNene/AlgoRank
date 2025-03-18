use std::env;

// User input
fn fibonacci(n: i32) -> i32 {
    if n <= 0 { return 0; }
    if n == 1 { return 1; }
    
    let mut prev = 0;
    let mut curr = 1;
    for _ in 2..=n {
        let next = prev + curr;
        prev = curr;
        curr = next;
    }
    curr
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(i32) -> i32, n: i32, expected: i32) {
        let result = func(n);
        if result == expected {
            println!("Test Case Passed: Result = {}, Expected = {}", result, expected);
        } else {
            println!("Failed Test Case: Result = {}, Expected = {}", result, expected);
        }
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("Usage: {} <n> <expected>", args[0]);
        std::process::exit(1);
    }

    let n: i32 = args[1].parse().expect("Invalid number");
    let expected: i32 = args[2].parse().expect("Invalid expected value");

    Checker::check(fibonacci, n, expected);
} 
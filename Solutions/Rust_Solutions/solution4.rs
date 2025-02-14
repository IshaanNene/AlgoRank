use std::env;

// User input
fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(&str) -> String, input: &str, expected: &str) {
        let result = func(input);
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
        eprintln!("Usage: {} <string> <expected>", args[0]);
        std::process::exit(1);
    }

    let input = &args[1];
    let expected = &args[2];

    Checker::check(reverse_string, input, expected);
} 
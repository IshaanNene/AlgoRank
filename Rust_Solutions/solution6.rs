use std::env;

// User input
fn is_palindrome(s: &str) -> bool {
    let chars: Vec<char> = s.chars()
        .filter(|c| c.is_alphanumeric())
        .map(|c| c.to_ascii_lowercase())
        .collect();
    
    let len = chars.len();
    for i in 0..len/2 {
        if chars[i] != chars[len-1-i] {
            return false;
        }
    }
    true
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(&str) -> bool, input: &str, expected: bool) {
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
    let expected: bool = args[2].parse().expect("Expected value must be true or false");

    Checker::check(is_palindrome, input, expected);
} 
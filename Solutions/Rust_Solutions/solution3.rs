use std::env;

// User input
fn find_max(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(i32, i32) -> i32, a: i32, b: i32, expected: i32) {
        let result = func(a, b);
        if result == expected {
            println!("Test Case Passed: Result = {}, Expected = {}", result, expected);
        } else {
            println!("Failed Test Case: Result = {}, Expected = {}", result, expected);
        }
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 4 {
        eprintln!("Usage: {} <a> <b> <expected>", args[0]);
        std::process::exit(1);
    }

    let a: i32 = args[1].parse().expect("Invalid first number");
    let b: i32 = args[2].parse().expect("Invalid second number");
    let expected: i32 = args[3].parse().expect("Invalid expected value");

    Checker::check(find_max, a, b, expected);
} 
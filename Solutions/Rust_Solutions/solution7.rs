use std::env;

// User input
fn find_max(arr: &[i32]) -> i32 {
    arr.iter()
       .max()
       .copied()
       .expect("Array is empty")
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(&[i32]) -> i32, arr: &[i32], expected: i32) {
        let result = func(arr);
        if result == expected {
            println!("Test Case Passed: Result = {}, Expected = {}", result, expected);
        } else {
            println!("Failed Test Case: Result = {}, Expected = {}", result, expected);
        }
    }
}

fn parse_array(input: &str) -> Vec<i32> {
    input[1..input.len()-1]  // Remove [ ]
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect()
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("Usage: {} <array> <expected>", args[0]);
        std::process::exit(1);
    }

    let arr = parse_array(&args[1]);
    let expected = args[2].parse().expect("Invalid expected value");

    Checker::check(find_max, &arr, expected);
} 
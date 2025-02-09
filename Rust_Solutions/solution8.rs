use std::env;

// User input
fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n-1 {
        for j in 0..n-i-1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(&mut [i32]), arr: &mut [i32], expected: &[i32]) {
        func(arr);
        let passed = arr == expected;
        
        if passed {
            println!("Test Case Passed: Result = {:?}, Expected = {:?}", arr, expected);
        } else {
            println!("Failed Test Case: Result = {:?}, Expected = {:?}", arr, expected);
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

    let mut arr = parse_array(&args[1]);
    let expected = parse_array(&args[2]);

    Checker::check(bubble_sort, &mut arr, &expected);
} 
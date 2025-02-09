use std::env;

// User input
fn search(nums: &[i32], target: i32) -> i32 {
    let mut left = 0;
    let mut right = nums.len() as i32 - 1;
    
    while left <= right {
        let mid = left + (right - left) / 2;
        let mid_idx = mid as usize;
        
        if nums[mid_idx] == target {
            return mid;
        }
        
        if nums[mid_idx] < target {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    -1
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(&[i32], i32) -> i32, nums: &[i32], target: i32, expected: i32) {
        let result = func(nums, target);
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
    if args.len() != 4 {
        eprintln!("Usage: {} <array> <target> <expected>", args[0]);
        std::process::exit(1);
    }

    let nums = parse_array(&args[1]);
    let target = args[2].parse().expect("Invalid target");
    let expected = args[3].parse().expect("Invalid expected value");

    Checker::check(search, &nums, target, expected);
} 
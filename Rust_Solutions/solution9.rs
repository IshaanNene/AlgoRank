use std::env;

// User input
fn generate_pascal(num_rows: i32) -> Vec<Vec<i32>> {
    let num_rows = num_rows as usize;
    let mut triangle = Vec::new();
    if num_rows == 0 { return triangle; }
    
    triangle.push(vec![1]); // First row
    
    for i in 1..num_rows {
        let mut row = vec![1; i + 1];
        for j in 1..i {
            row[j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
        triangle.push(row);
    }
    triangle
}
// End of user input

struct Checker;

impl Checker {
    fn check(func: fn(i32) -> Vec<Vec<i32>>, num_rows: i32, expected: &[Vec<i32>]) {
        let result = func(num_rows);
        let passed = result == expected;
        
        println!("{}", if passed { "Test Case Passed:" } else { "Failed Test Case:" });
        println!("Result = {:?}", result);
        println!("Expected = {:?}", expected);
    }
}

fn parse_triangle(input: &str) -> Vec<Vec<i32>> {
    let input = &input[1..input.len()-1]; // Remove outer []
    if input.is_empty() { return vec![]; }
    
    input.split("],[")
        .map(|row| {
            row.trim_matches(|c| c == '[' || c == ']')
                .split(',')
                .filter(|s| !s.is_empty())
                .map(|s| s.parse().unwrap())
                .collect()
        })
        .collect()
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("Usage: {} <numRows> <expected>", args[0]);
        std::process::exit(1);
    }

    let num_rows = args[1].parse().expect("Invalid number of rows");
    let expected = parse_triangle(&args[2]);

    Checker::check(generate_pascal, num_rows, &expected);
} 
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  topics: string[] = [
    'Arrays & Strings',
    'Hashmaps & Sets',
    '2 Pointers',
    'Stacks',
    'Linked Lists',
    'Binary Search',
    'Sliding Window',
    'Trees',
    'Heaps',
    'Recursive Backtracking',
    'Graphs',
    'Dynamic Programming',
    'Finish!',
  ];

  problems: { [key: string]: string[] } = {
    'Arrays & Strings': [
      'Two Sum',
      'Best Time to Buy and Sell Stock',
      'Rotate Image',
    ],
    'Hashmaps & Sets': ['Contains Duplicate', 'Group Anagrams'],
    '2 Pointers': ['Container With Most Water', '3Sum'],
    Stacks: ['Valid Parentheses', 'Evaluate Reverse Polish Notation'],
    'Linked Lists': ['Add Two Numbers', 'Reverse Linked List'],
    'Binary Search': ['Binary Search', 'Search in Rotated Sorted Array'],
    'Sliding Window': [
      'Longest Substring Without Repeating Characters',
      'Minimum Window Substring',
    ],
    Trees: ['Maximum Depth of Binary Tree', 'Validate Binary Search Tree'],
    Heaps: ['Merge k Sorted Lists', 'Top K Frequent Elements'],
    'Recursive Backtracking': ['Permutations', 'Combination Sum'],
    Graphs: ['Number of Islands', 'Clone Graph'],
    'Dynamic Programming': ['Climbing Stairs', 'House Robber'],
  };
}

import { Injectable } from '@angular/core';
import { Problem } from './models';
import { LocalStorageService } from '../common/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  private solvedProblemsKey = 'solvedProblems';

  constructor(private localStorageService: LocalStorageService) {}

  getSolvedProblems(): string[] {
    const solvedProblems = this.localStorageService.get<string[]>(
      this.solvedProblemsKey
    );
    return solvedProblems ?? [];
  }

  addSolvedProblem(problemId: string): void {
    const solvedProblems = this.getSolvedProblems();
    if (!solvedProblems.includes(problemId)) {
      solvedProblems.push(problemId);
      this.localStorageService.save(this.solvedProblemsKey, solvedProblems);
    }
  }

  removeSolvedProblem(problemId: string): void {
    let solvedProblems = this.getSolvedProblems();
    solvedProblems = solvedProblems.filter((problem) => problem !== problemId);
    this.localStorageService.save(this.solvedProblemsKey, solvedProblems);
  }

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

  problems: { [key: string]: Problem[] } = {
    'Arrays & Strings': [
      {
        name: 'Two Sum',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/two-sum/',
        number: '1',
      },
      {
        name: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        number: '121',
      },
      {
        name: 'Rotate Image',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/rotate-image/',
        number: '48',
      },
      {
        name: 'Find Closest Number to Zero',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/find-closest-number-to-zero/description/',
        number: '2529',
      },
      {
        name: 'Merge Strings Alternately',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/merge-strings-alternately/',
        number: '1768',
      },
      {
        name: 'Roman to Integer',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/roman-to-integer/',
        number: '13',
      },
      {
        name: 'Is Subsequence',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/is-subsequence/',
        number: '392',
      },
      {
        name: 'Longest Common Prefix',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/longest-common-prefix/',
        number: '14',
      },
      {
        name: 'Summary Ranges',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/summary-ranges/',
        number: '228',
      },
      {
        name: 'Product of Array Except Self',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/product-of-array-except-self/',
        number: '238',
      },
      {
        name: 'Merge Intervals',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/merge-intervals/',
        number: '56',
      },
      {
        name: 'Spiral Matrix',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/spiral-matrix/',
        number: '54',
      },
    ],
    'Hashmaps & Sets': [
      {
        name: 'Jewels and Stones',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/jewels-and-stones/',
        number: '771',
      },
      {
        name: 'Contains Duplicate',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        number: '217',
      },
      {
        name: 'Ransom Note',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/ransom-note/',
        number: '383',
      },
      {
        name: 'Valid Anagram',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/valid-anagram/',
        number: '242',
      },
      {
        name: 'Maximum Number of Balloons',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/maximum-number-of-balloons/',
        number: '1189',
      },
      {
        name: 'Majority Element',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/majority-element/',
        number: '169',
      },
      {
        name: 'Longest Consecutive Sequence',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        number: '128',
      },
      {
        name: 'Squares of a Sorted Array',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
        number: '977',
      },
      {
        name: 'Reverse String',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/reverse-string/',
        number: '344',
      },
    ],
    '2 Pointers': [
      {
        name: 'Valid Parentheses',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        number: '20',
      },
      {
        name: 'Evaluate Reverse Polish Notation',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        number: '150',
      },
      {
        name: 'Daily Temperatures',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/daily-temperatures/',
        number: '739',
      },
      {
        name: 'Min Stack',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/min-stack/',
        number: '155',
      },
    ],
    Stacks: [
      {
        name: 'Baseball Game',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/baseball-game/',
        number: '682',
      },
    ],
    'Linked Lists': [
      {
        name: 'Remove Duplicates from Sorted List',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/',
        number: '83',
      },
      {
        name: 'Reverse Linked List',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        number: '206',
      },
      {
        name: 'Merge Two Sorted Lists',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        number: '21',
      },
      {
        name: 'Linked List Cycle',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/linked-list-cycle/',
        number: '141',
      },
      {
        name: 'Middle of the Linked List',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
        number: '876',
      },
      {
        name: 'Remove Nth Node from End of List',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        number: '19',
      },
      {
        name: 'Copy List with Random Pointer',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
        number: '138',
      },
    ],
    'Binary Search': [
      {
        name: 'Maximum Average Subarray I',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
        number: '643',
      },
      {
        name: 'Max Consecutive Ones III',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
        number: '1004',
      },
      {
        name: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        number: '3',
      },
      {
        name: 'Longest Repeating Character Replacement',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
        number: '424',
      },
      {
        name: 'Minimum Size Subarray Sum',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        number: '209',
      },
      {
        name: 'Permutation in String',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/permutation-in-string/',
        number: '567',
      },
    ],
    'Sliding Window': [
      {
        name: 'Maximum Average Subarray I',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
        number: '643',
      },
      {
        name: 'Max Consecutive Ones III',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
        number: '1004',
      },
      {
        name: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        number: '3',
      },
    ],
    Trees: [
      {
        name: 'Invert Binary Tree',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/invert-binary-tree/',
        number: '226',
      },
      {
        name: 'Maximum Depth of Binary Tree',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        number: '104',
      },
      {
        name: 'Balanced Binary Tree',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/balanced-binary-tree/',
        number: '110',
      },
      {
        name: 'Diameter of Binary Tree',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
        number: '543',
      },
      {
        name: 'Same Binary Tree',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/same-tree/',
        number: '100',
      },
      {
        name: 'Symmetric Tree',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/symmetric-tree/',
        number: '101',
      },
    ],
    Heaps: [
      {
        name: 'Last Stone Weight',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/last-stone-weight/',
        number: '1046',
      },
      {
        name: 'Kth Largest Element in an Array',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        number: '215',
      },
      {
        name: 'Top K Frequent Elements',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        number: '347',
      },
      {
        name: 'K Closest Points to Origin',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
        number: '973',
      },
      {
        name: 'Merge K Sorted Linked Lists',
        difficulty: 'hard',
        status: 'todo',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        number: '23',
      },
    ],
    'Recursive Backtracking': [
      {
        name: 'Subsets',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/subsets/',
        number: '78',
      },
      {
        name: 'Permutations',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/permutations/',
        number: '46',
      },
      {
        name: 'Combinations',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/combinations/',
        number: '77',
      },
      {
        name: 'Combination Sum',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/combination-sum/',
        number: '39',
      },
      {
        name: 'Letter Combinations of a Phone Number',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
        number: '17',
      },
      {
        name: 'Generate Parentheses',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/generate-parentheses/',
        number: '22',
      },
    ],
    Graphs: [
      {
        name: 'Word Search',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/word-search/',
        number: '79',
      },
      {
        name: 'Find if Path Exists in Graph',
        difficulty: 'easy',
        status: 'todo',
        url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/',
        number: '1971',
      },
      {
        name: 'Number of Islands',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/number-of-islands/',
        number: '200',
      },
      {
        name: 'Max Area of Island',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/max-area-of-island/',
        number: '695',
      },
      {
        name: 'Course Schedule',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/course-schedule/',
        number: '207',
      },
      {
        name: 'Course Schedule II',
        difficulty: 'medium',
        status: 'todo',
        url: 'https://leetcode.com/problems/course-schedule-ii/',
        number: '210',
      },
    ],
    'Dynamic Programming': [
      {
        name: 'Longest Increasing Subsequence',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        status: 'todo',
        difficulty: 'medium',
        number: '300',
      },
      {
        name: 'Coin Change',
        url: 'https://leetcode.com/problems/coin-change/',
        status: 'todo',
        difficulty: 'medium',
        number: '322',
      },
    ],
  };
}

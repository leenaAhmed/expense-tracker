 export enum ExpenseCategory {
  GROCERIES = 'Groceries',
  ENTERTAINMENT = 'Entertainment',
  TRANSPORT = 'Transportation',
  RENT = 'Rent',
  NEWS_PAPER = 'News Paper',
  GAS = 'Gas',
  SHOPPING = 'Shopping'
}

export interface CategoryOption {
  name: ExpenseCategory;
  icon: string;
  color: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { name: ExpenseCategory.GROCERIES, icon: 'shopping-cart', color: '#6C5DD3' },
  { name: ExpenseCategory.ENTERTAINMENT, icon: 'music', color: '#4169E1' },
  { name: ExpenseCategory.GAS, icon: 'fuel', color: '#FF6B9D' },
  { name: ExpenseCategory.SHOPPING, icon: 'shopping-bag', color: '#FFA500' },
  { name: ExpenseCategory.NEWS_PAPER, icon: 'newspaper', color: '#FFB800' },
  { name: ExpenseCategory.TRANSPORT, icon: 'car', color: '#9370DB' },
  { name: ExpenseCategory.RENT, icon: 'home', color: '#FFB6C1' }
];
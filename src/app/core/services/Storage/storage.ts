import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'expense_tracker_data';

  setItem<T>(key: string, value: T): void {
    try {
      const data = this.getAllData();
      data[key] = value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const data = this.getAllData();
      return data[key] || null;
    } catch {
      return null;
    }
  }

  private getAllData(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
}

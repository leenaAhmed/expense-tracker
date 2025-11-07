import { Injectable } from '@angular/core';
import { ShoppingCart, IceCreamCone, CarFront, House, Newspaper, Building2, ShoppingBag } from 'lucide-angular';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private readonly categoryColors: { [key: string]: string } = {
    'Groceries': '#6C5DD3',
    'Entertainment': '#4169E1',
    'Transportation': '#9370DB',
    'Rent': '#FFB6C1',
    'News Paper': '#FFB800',
    'Gas': '#FF6B9D',
    'Shopping': '#FFA500'
  };

  private readonly categoryIcons: { [key: string]: any } = {
    'Groceries': ShoppingCart,
    'Entertainment':IceCreamCone ,
    'Transportation': CarFront,
    'Rent': House,
    'News Paper': Newspaper,
    'Gas': Building2,
    'Shopping': ShoppingBag
  };

  getCategoryColor(category: string): string {
    return this.categoryColors[category] || '#6B7280';
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || 'circle';
  }

  getCategories(): string[] {
    return Object.keys(this.categoryColors);
  }


  formatCurrency(amount: number): string {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

   formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }
}

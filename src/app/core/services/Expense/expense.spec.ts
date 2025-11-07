import { TestBed } from '@angular/core/testing';

import { ExpenseService } from './expense';
import { CurrencyService } from '../Currency/currency';
import { StorageService } from '../Storage/storage';
import { ExpenseCategory } from '../../models/category.model';
import { of } from 'rxjs';

describe('Expense', () => {
  let service: ExpenseService;
  let storageService: jasmine.SpyObj<StorageService>;
  let currencyService: jasmine.SpyObj<CurrencyService>;


  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem']);
    const currencySpy = jasmine.createSpyObj('CurrencyService', ['convertToUSD']);

    TestBed.configureTestingModule({
      providers: [
        ExpenseService,
        { provide: StorageService, useValue: storageSpy },
        { provide: CurrencyService, useValue: currencySpy }
      ]
    });

    service = TestBed.inject(ExpenseService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    currencyService = TestBed.inject(CurrencyService) as jasmine.SpyObj<CurrencyService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('addExpense', () => {
    it('should add expense with USD conversion', (done) => {
      const mockExpense = {
        category: ExpenseCategory.GROCERIES,
        categoryIcon: 'shopping-cart' ,
        amount: 100,
        currency: 'EUR',
        date: new Date(),
        createdAt: new Date(),
        frequency: 'Manually' as any
      };

      currencyService.convertToUSD.and.returnValue(of(110));
      storageService.getItem.and.returnValue([]);

      service.addExpense(mockExpense).subscribe(() => {
        expect(currencyService.convertToUSD).toHaveBeenCalledWith(100, 'EUR');
        expect(storageService.setItem).toHaveBeenCalled();
        done();
      });
    });

    it('should handle USD  without conversion', (done) => {
      const mockExpense = {
        category: ExpenseCategory.GROCERIES,
        categoryIcon: 'shopping-cart',
        amount: 50,
        currency: 'USD',
        date: new Date(),
        createdAt: new Date(),
        frequency: 'Manually' as any
      };

      currencyService.convertToUSD.and.returnValue(of(50));
      storageService.getItem.and.returnValue([]);

      service.addExpense(mockExpense).subscribe(() => {
        expect(storageService.setItem).toHaveBeenCalled();
        done();
      });
    });
  })
});

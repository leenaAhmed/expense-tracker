import { Injectable } from '@angular/core';
import { StorageService } from '../Storage/storage';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private storage: StorageService){}
  login(_email: any, _password: any){
    const name = _email.split('@')[0];
    const userId = Date.now().toString();
    this.storage.setItem<User>('user', { id: userId, name: name, email: _email });
    return true;
  }

  getCurrentUser(){
    return this.storage.getItem<User>('user') as User | null;
  }

  logout(){
    this.storage.setItem<User>('user', { id: '', name: '', email: '' });
    return true;
  }
}

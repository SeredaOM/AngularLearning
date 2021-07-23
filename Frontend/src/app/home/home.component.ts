import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
	products = [];

	constructor(private apiService: ApiService) { }

	ngOnInit() {
		this.products.push({ name: 'Child', price: 100000, quantity: 1, description: 'This is well-behaved child ready for forced adoption', instock: 314 });
		this.products.push({ name: 'Grenade', price: 1200, quantity: 25, description: 'Makes very big boom, very useful to blow up your newborn child', instock: 40000 });
		this.products.push({ name: 'Plutonium Core', price: 400000, quantity: 1, description: 'Main part of a nuclear bomb', instock: 30 });
		this.products.push({ name: '!!!NAME TEMPORARILY REMOVED!!!', price: '!!!NAME TEMPORARILY REMOVED!!!', quantity: '!!!NAME TEMPORARILY REMOVED!!!', description: '!!!NAME TEMPORARILY REMOVED!!!', instock: '!!!NAME TEMPORARILY REMOVED!!!' });
		this.products.push({ name: 'SurvivalCraft', price: 5, quantity: 1, description: 'The best video game, early release', instock: 99999999999 });
		this.products.push({ name: 'Book Collection', price: 10, quantity: 6, description: 'Books made by Denys himself!', instock: 30040 });
	}
}


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
		this.products.push({ name: 'Child', price: 123, quantity: 15, description: 'This is well-behaved child ready for adoption' });
	}
}

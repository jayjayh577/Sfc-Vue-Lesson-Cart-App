<template>
    <div>
     <h1>Welcome to the Checkout Page</h1>
      <div class="row align-items-center">
        <div v-for="cart in sortedCarts" :key="cart.id" class="col-lg-2 col-md-4 mt-1">
          <div class="card bg-light woop">
            <img width="200" height="200" v-bind:src="cart.image" class="card-img-top">
            <div class="card-body text-center">
              <h5 class="card-title">Subject: {{cart.subject}}</h5>
              <p class="card-text"><i class="fa-solid fa-location-dot"></i> Location: {{cart.location}}</p>
              <p class="card-text">Price: <i class="fa-solid fa-sterling-sign"></i> {{cart.price}}</p>
              <p class="card-text">Lessons Added: {{cart.AddedTOCart}}</p>
              <button @click="removeFromCart(cart)" class="btn rounded-5 text-light btn-dark">Remove course</button>
            </div>
          </div>   
        </div>
      </div>

      <h1>{{checkoutinfo}}</h1>
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div>
              <label for="name">Name:</label>
              <input type="text" class="form-control" v-model="NameValid" />
            </div>
          </div>
          <div class="col-md-6">
            <div>
              <label for="phone">Phone:</label>
              <input placeholder="Input Country Code" type="tel" class="form-control" v-model="NumberValid" />
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <div>Name: {{ NameValid }}</div>
          </div>
          <div class="col-md-6">
            <div>Number: {{ NumberValid }}</div>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-dark mt-3" :disabled="!isNameandNumberValid" v-on:click="checkout">Checkout</button>
    </div>
  </template>


<script>
export default {
  name: "ProductList",
  props: {
    sortedCarts: {
      type: Array,
      required: true
    },
    removeFromCart: {
      type: Function,
      required: true
    },
    checkoutinfo: {
      type: String,
      required: true
    },
    checkout: {
      type: Function,
      required: true
    },
  },
   data() { return { 
      NameValid: "",
      NumberValid: "",
     } },
  methods: {
    isNameandNumberValid() {
          const namePattern = /^[a-zA-Z ]+$/;
          const phoneNumberTest =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
          return (
            namePattern.test(this.NameValid) &&
            phoneNumberTest.test(this.NumberValid)
          );
        }
  }
};
</script>
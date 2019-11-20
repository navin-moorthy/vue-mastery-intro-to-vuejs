Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
        <div class="product-image">
          <img v-bind:src="image" alt="Sock" />
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>

          <shipping-details-tab :details="details" :shipping="shipping"></shipping-details-tab>

          <h4>Available Colors</h4>

          <div
            v-for="(color, index) in colors"
            :key="color.variantId"
            class="color-box"
            :style="{backgroundColor: color.variantColor}"
            v-on:mouseover="updateColor(index)"
          ></div>

          <p v-if="inStock">In Stock</p>
          <p v-else :class="{lineThrough: !inStock}">Out of Stock</p>

          <div>
            <button
              @click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock}"
            >
              Add to Cart
            </button>

            </div>
            </div>

        <product-tabs :reviews="reviews"></product-tabs>
      </div>
  `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedColor: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      colors: [
        {
          variantId: 432,
          variantColor: "#309b64",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10
        },
        {
          variantId: 345,
          variantColor: "#40546e",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart: function() {
      this.$emit("add-to-cart", this.colors[this.selectedColor].variantId);
    },
    updateColor: function(index) {
      this.selectedColor = index;
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.colors[this.selectedColor].variantImage;
    },
    inStock() {
      return this.colors[this.selectedColor].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return "2.99$";
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.rating = null;
        this.review = null;
        this.errors.length = 0;
      } else {
        if (!this.name) this.errors.push("Name Required!");
        if (!this.review) this.errors.push("Review Required!");
        if (!this.rating) this.errors.push("Rating Required!");
      }
    }
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      required: true,
      type: Array
    }
  },
  template: `
    <div>
      <span
        class="tab"
        :class="{activeTab: selectedTab === tab}"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab"

      >
        {{tab}}
      </span>

      <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet!!</p>
        <ul>
          <li v-for="review in reviews">
            <p>Name: {{review.name}}</p>
            <p>Rating: {{review.rating}}</p>
            <p>Review Given: {{review.review}}</p>
          </li>
        </ul>
      </div>
      <product-review v-show="selectedTab === 'Make a review'"></product-review>
    </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a review"],
      selectedTab: "Reviews"
    };
  }
});

Vue.component("shipping-details-tab", {
  props: {
    shipping: {
      required: true
    },
    details: {
      required: true,
      type: Array
    }
  },
  template: `
    <div>
      <span
        class="tab"
        :class="{activeTab: selectedTab === tab}"
        v-for="(tab,index) in tabs"
        @click="selectedTab = tab"
      >
      {{tab}}
      </span>

      <ul v-show="selectedTab === 'Details'">
        <li v-for="detail in details">{{ detail }}</li>
      </ul>

      <h5 v-show="selectedTab === 'Shipping'">Shipping: {{shipping}}</h5>
    </div>
  `,
  data() {
    return {
      tabs: ["Details", "Shipping"],
      selectedTab: "Details"
    };
  }
});

var eventBus = new Vue();

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
    toggle: true,
    rawHtml: '<span style="color: red">This should be red.</span>',
    // v-bind
    isButtonDisabled: true,
    // computed
    message: "Hello",
    // computed getter & setter
    firstName: "Navin",
    lastName: "Navi",
    // Watchers
    question: "",
    answer: "I cannot give you an answer until you ask a question!"
  },
  watch: {
    // whenever question changes, this function will run
    question: function(newQuestion, oldQuestion) {
      this.answer = "Waiting for you to stop typing...";
      this.debouncedGetAnswer();
    }
  },
  computed: {
    // a computed getter
    reversedMessage: function() {
      // `this` points to the vm instance
      return this.message
        .split("")
        .reverse()
        .join("");
    },
    // computed getter & setter
    fullName: {
      // getter
      get: function() {
        return this.firstName + " " + this.lastName;
      },
      // setter
      set: function(newValue) {
        var names = newValue.split(" ");
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
      }
    }
  },
  methods: {
    updateCart: function(id) {
      this.cart.push(id);
    },
    getAnswer: function() {
      if (this.question.indexOf("?") === -1) {
        this.answer = "Questions usually contain a question mark. ;-)";
        return;
      }
      this.answer = "Thinking...";
      const vm = this;
      axios
        .get("https://yesno.wtf/api")
        .then(function(response) {
          vm.answer = _.capitalize(response.data.answer);
        })
        .catch(function(error) {
          vm.answer = "Error! Could not reach the API. " + error;
        });
    }
  },
  beforeCreate() {
    console.log("🍏Before Create");
  },
  created() {
    console.log("🍎Created");

    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // yesno.wtf/api, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
  },
  beforeMount() {
    console.log("🍐Before Mount");
  },
  mounted() {
    console.log("🍊Mounted");
  },
  beforeUpdate() {
    console.log("🍋Before Update");
  },
  updated() {
    console.log("🍌Updated");
  },
  beforeDestroy() {
    console.log("🍉Before Destroy");
  },
  destroyed() {
    console.log("🍇Destroyed");
  }
});

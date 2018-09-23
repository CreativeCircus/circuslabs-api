# How to use the Circus General Purpose API v2.0.0

## What?!?!
What's this for? Well, sometimes you need to build a thing, but you only want to worry about the front-end. But if it needs to store data on a server somewhere, so that more than one user can submit or retrieve the same data, you need a back-end right? So what do you do? Well, you send the data to be stored on the Circus general purpose API, of course!

The Circus general purpose API will store whatever string or number you want. Later, you can retrieve or modify that string or number. All via AJAX.

## URLs
Construct your URLs like this:
`http://circuslabs.net:3000/data/your-key-here`
The same URL is used for getting and setting data. Replace `your-key-here` with whatever name you want your data to be stored in. Make it something that is unlikely to be used by another student.


## Basic Usage Examples
These examples use [Axios](https://github.com/axios/axios). 
Make sure you add it to your project before use.

`<script src="https://unpkg.com/axios/dist/axios.min.js"></script>`

### Getting (GETting) Data from the API
Do a GET request for the API URL with your chosen "key". 

```javascript
axios.get('http://circuslabs.net:3000/data/example-key-12345').then(function (response) {
  console.log('here is the response data for key:', response);
})
```

### Sending (POSTing) data to the API
Do a POST request for the above URL, with a data object describing the data you want to store or update. If data already exists, it will be overwritten or modified. If it doesn't, it will be created.

```javascript
axios.post('http://circuslabs.net:3000/data/example-key-12345', {
  type: 'string',
  value: 'Hello World'
})
```

#### Sending (POSTing) different types of data.

Inside the data object, you need to specify a `type`. Valid types are `string` and `number`.

If you are storing a `string`, you also need to provide a `content` property, with the string you want to store.
```javascript
{
  type: 'string',
  value: 'Hello World'
}
```

If you are storing a `number`, you also need to provide an `action` property, with action you want to perform on the number, and sometimes a `quantity` property, with the amount you want to perform said action. See the examples if this doesn't make sense.
```javascript
{
  type: 'number',
  action: '++' // increases the number by 1
}
```
```javascript
{
  type: 'number',
  action: '--' // decreases the number by 1
}
```
```javascript
{
  type: 'number',
  action: '+=', // increases the number by the number in the quantity property. Hint, use a negative number to decrease
  value: 5
}
```
```javascript
{
  type: 'number',
  action: '=', // sets the number to equal to the number in the quantity property
  value: 5
}
```





## Detailed Usage Examples
The below examples organize the code a little better, and handle errors properly.

### GET data from server (Axios)
```javascript
  // key = the key name under which your data is stored
  let key = 'example-key-12345';
  axios.get('http://circuslabs.net:3000/data/' + key)
  .then(function (responseData) {
    console.log('here is the response data:', responseData);
  })
  .catch(function (error) {
    console.warn('axios encountered an error!', error);
  }); 
```

### POST data to server (Axios)

```javascript

  // key = the key name under which to store your data
  // value = the value to save (this example assumes a string)
  let key = 'example-key-12345';
  let value = 'Hello World!';
  let data = {
    type: 'string',
    value: value
  };
  axios.post('http://circuslabs.net:3000/data/' + key, data)
  .then(function (responseData) {
    console.log('here is the response data:', responseData);
  })
  .catch(function (error) {
    console.warn('axios encountered an error!', error);
  }); 
```


### GET data from server (Native Fetch API)
```javascript
  // key = the key name under which your data is stored
  let key = 'example-key-12345';
  fetch('http://circuslabs.net:3000/data/' + key, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return '';
  })
  .then(responseData => {
    console.log('here is the response data:', key, responseData);
  })
  .catch(function(err) {
    console.warn('error!', err);
  });
```

### POST data to server (Native Fetch API)

```javascript

  // key = the key name under which to store your data
  // value = the value to save (this example assumes a string)
  let key = 'example-key-12345';
  let value = 'Hello World!';
  let data = {
    type: "string",
    value: value
  };
  fetch('http://circuslabs.net:3000/data/' + key, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(responseData => {
    console.log('here is the saved response data:', responseData);
  })
  .catch(function(err) {
    console.warn('error!', err);
  });
```

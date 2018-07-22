define({ "api": [
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "get",
    "url": "/api/v1/todolist/getAllLists/:userId",
    "title": "to getAllLists .",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "        {\n    \"error\": false,\n    \"message\": \"All List Details Found\",\n    \"status\": 200,\n    \"data\": [\n        {\n            \"_id\": \"5b53e9224a15531eccd2141a\",\n            \"userId\": \"ryaV5mkQX\",\n            \"listName\": \"manoj\",\n            \"listId\": \"SkcQYw-Em\",\n            \"__v\": 0,\n            \"modifiedOn\": \"2018-07-22T02:11:36.442Z\",\n            \"createdOn\": \"2018-07-22T02:17:06.000Z\"\n        },\n        {\n            \"_id\": \"5b54652bfc6c4f1b78329590\",\n            \"userId\": \"ryaV5mkQX\",\n            \"listName\": \"mouni\",\n            \"listId\": \"ryc1B1f47\",\n            \"__v\": 0,\n            \"modifiedOn\": \"2018-07-22T11:04:12.941Z\",\n            \"createdOn\": \"2018-07-22T11:06:19.000Z\"\n        },\n        \n        \n        \n    ]\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/todoList.js",
    "groupTitle": "todolist",
    "name": "GetApiV1TodolistGetalllistsUserid"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/createList",
    "title": "to createList .",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>userId of the user. (auth headers) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listName",
            "description": "<p>listName of the user. (auth headers) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\": false,\n    \"message\": \"List created\",\n    \"status\": 200,\n    \"data\": {\n        \"__v\": 0,\n        \"userId\": \"ryaV5mkQX\",\n        \"listName\": \"name\",\n        \"listId\": \"SyuEFgGEX\",\n        \"_id\": \"5b54792fbe010b20e0dd8ce1\",\n        \"modifiedOn\": \"2018-07-22T12:31:31.277Z\",\n        \"createdOn\": \"2018-07-22T12:31:43.000Z\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/todoList.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistCreatelist"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/forgot",
    "title": "to forgot password user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "forgotEmail",
            "description": "<p>forgotEmail of the user. (auth headers) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Reset Link Sent to your mail\",\n    \"status\": 200,\n    \"data\": {\n        \"__v\": 0,\n        \"resetPasswordToken\": \"e7dd6cd10df03c1f833c0b90a70fd7b8da05ee50\",\n        \"resetPasswordExpires\": \"2018-07-22T12:29:39.018Z\",\n        \"_id\": \"kjdsdggfdg\",\n        \"email\": \"manojprabhaka@gmail.com\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistForgot"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/login",
    "title": "api for user login.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Login Successful\",\n    \"status\": 200,\n    \"data\": {\n        \"authToken\": \"eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc\",\n        \"userDetails\": {\n        \"mobileNumber\": 2234435524,\n        \"email\": \"someone@mail.com\",\n        \"lastName\": \"Sengar\",\n        \"firstName\": \"Rishabh\",\n        \"userId\": \"-E9zxTYA8\"\n    }\n\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistLogin"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/logout",
    "title": "to logout user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>userId of the user. (auth headers) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"Logged Out Successfully\",\n    \"status\": 200,\n    \"data\": null\n\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistLogout"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/reset",
    "title": "to reset user.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "resetPassword",
            "description": "<p>resetPassword of the user. (auth headers) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "resetPasswordToken",
            "description": "<p>resetPasswordToken of the user. (auth headers) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "        {\n    \"error\": false,\n    \"message\": \"Password Updated Successfully\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"nModified\": 1,\n        \"ok\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistReset"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/signup",
    "title": "api for user signup.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>firstName of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>lastName of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "countryCode",
            "description": "<p>countryCode of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mobileNumber",
            "description": "<p>mobileNumber of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>password of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"SignUp Successful\",\n    \"status\": 200,\n    \"data\": {\n        \"authToken\": \"eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc\",\n        \"userDetails\": {\n        \"mobileNumber\": 2234435524,\n        \"email\": \"someone@mail.com\",\n        \"lastName\": \"Sengar\",\n        \"firstName\": \"Rishabh\",\n        \"userId\": \"-E9zxTYA8\"\n    }\n\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/user.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistSignup"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/:userId/:listId/acceptFriend",
    "title": "to acceptFriend .",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "friendRequestId",
            "optional": false,
            "field": "friendRequestId",
            "description": "<p>friendRequestId of the friend user. (auth headers) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    {\n    \"error\": false,\n    \"message\": \"FriendRequest Details Saved Successfully\",\n    \"status\": 200,\n    \"data\": {\n        \"__v\": 0,\n        \"friendRequestId\": \"Hy3E5xMVm\",\n        \"friendId\": \"ryaV5mkQX\",\n        \"friendEmail\": \"manojprabhakar675@gmail.com\",\n        \"userId\": \"S128st-Nm\",\n        \"listId\": \"Bk1vE6ZVm\",\n        \"userEmail\": \"prabhakar.manoj@divum.in\",\n        \"userName\": \"Manoj  K\",\n        \"_id\": \"5b547a33be010b20e0dd8ce2\",\n        \"modifiedOn\": \"2018-07-22T12:31:31.239Z\",\n        \"createdOn\": \"2018-07-22T12:36:03.000Z\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/todoList.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistUseridListidAcceptfriend"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/todolist/:userId/:listId/sentFriendRequest",
    "title": "to sentFriendRequest .",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "email",
            "optional": false,
            "field": "email",
            "description": "<p>email of the friend user. (auth headers) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "                    {\n    \"error\": false,\n    \"message\": \"FriendRequest Accepted Successfully\",\n    \"status\": 200,\n    \"data\": {\n        \"__v\": 0,\n        \"userId\": \"ryaV5mkQX\",\n        \"listName\": \"mouni\",\n        \"listId\": \"ryc1B1f47\",\n        \"_id\": \"5b547b30be010b20e0dd8ce3\",\n        \"modifiedOn\": \"2018-07-22T12:31:31.277Z\",\n        \"createdOn\": \"2018-07-22T12:40:16.000Z\"\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/todoList.js",
    "groupTitle": "todolist",
    "name": "PostApiV1TodolistUseridListidSentfriendrequest"
  },
  {
    "group": "todolist",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/:userId/:listId/deleteList",
    "title": "to deleteList .",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {\n    \"error\": false,\n    \"message\": \"List Deleted Successfully\",\n    \"status\": 200,\n    \"data\": {\n        \"n\": 1,\n        \"nModified\": 1,\n        \"ok\": 1\n    }\n}",
          "type": "object"
        }
      ]
    },
    "filename": "routes/todoList.js",
    "groupTitle": "todolist",
    "name": "PostApiV1UseridListidDeletelist"
  }
] });

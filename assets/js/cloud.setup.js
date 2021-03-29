/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"subscribe":{"verb":"POST","url":"/api/v1/table/subscribe","args":[]},"addTable":{"verb":"POST","url":"/api/v1/add-table","args":["name","price"]},"tableData":{"verb":"POST","url":"/api/v1/table-data","args":["id"]},"tableStart":{"verb":"POST","url":"/api/v1/table-start","args":["id"]},"editTable":{"verb":"PATCH","url":"/api/v1/edit-table","args":["id","name","price"]},"deleteTable":{"verb":"DELETE","url":"/api/v1/delete-table","args":["id"]},"addTimerServices":{"verb":"POST","url":"/api/v1/add-timer-services","args":["id","qty","tableId","timerId"]},"updateTimerServices":{"verb":"PATCH","url":"/api/v1/update-timer-services","args":["id","qty"]},"deleteTimerServices":{"verb":"DELETE","url":"/api/v1/delete-timer-services","args":["id","tableId","timerId"]},"checkout":{"verb":"POST","url":"/api/v1/checkout","args":["id"]},"addServices":{"verb":"POST","url":"/api/v1/services/add-services","args":["name","price"]},"updateServices":{"verb":"PATCH","url":"/api/v1/services/update-services","args":["id","name","price"]},"getServices":{"verb":"GET","url":"/api/v1/services/get-services","args":[]}}
  /* eslint-enable */

});

'use strict';

import Config from './config';
import Cookie from './cookie-handler';

export default {
  self: window.OneSignal || [],
  init () {
    var self = this.self;
    self.push(["init", {
      appId: Config.notifAppId,
      autoRegister: false,
      notifyButton: {
        enable: false /* Set to false to hide */
      }
    }]);
  },
  isPushEnabled () {
    var self = this.self;
    self.push(function() {
      self.isPushNotificationsEnabled(function(isEnabled) {
        if (isEnabled)
          return true;
        else
          return false;    
      });
    });
  },
  register () {
    var self = this.self;
    if(this.isPushEnabled() === false) {
      self.push(function() {
        self.registerForPushNotifications({
          modalPrompt: true
        });
      });
    }    
  },
  getUserID (callback) {
    var self = this.self;
    self.push(function() {
      self.getUserId().then(function(callback) {
      console.log("OneSignal User ID:", callback);
      //callback = userId;
      });
    });
  }
};
//TODO
import Time "mo:core/Time";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Use data migration for persistent changes

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type LoveMessage = {
    title : Text;
    date : Time.Time;
    content : Text;
  };

  module LoveMessage {
    public func compareByDate(m1 : LoveMessage, m2 : LoveMessage) : Order.Order {
      Int.compare(m1.date, m2.date);
    };
    public func compareByTitle(m1 : LoveMessage, m2 : LoveMessage) : Order.Order {
      Text.compare(m1.title, m2.title);
    };
  };

  type MemoryItem = {
    name : Text;
    description : Text;
  };

  module MemoryItem {
    public func compare(m1 : MemoryItem, m2 : MemoryItem) : Order.Order {
      Text.compare(m1.name, m2.name);
    };
  };

  type Photo = {
    title : Text;
    timestamp : Time.Time;
    galleryImage : Storage.ExternalBlob;
  };

  type MusicTrack = {
    title : Text;
    timestamp : Time.Time;
    audioFile : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  // Initialize persistent state - actor fields
  let loveMessages = Map.empty<Text, LoveMessage>();
  let memories = List.empty<MemoryItem>();
  let photos = Map.empty<Text, Photo>();
  let music = Map.empty<Text, MusicTrack>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Love messages - only users can add
  public shared ({ caller }) func addLoveMessage(title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add love messages");
    };
    if (loveMessages.containsKey(title)) {
      Runtime.trap("Message with this title already exists");
    };
    let date = Time.now();
    let message = {
      title;
      date;
      content;
    };
    loveMessages.add(title, message);
  };

  // Memories - only users can add
  public shared ({ caller }) func addMemory(name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add memories");
    };
    let memory = {
      name;
      description;
    };
    memories.add(memory);
  };

  // Photos - only users can add
  public shared ({ caller }) func addPhoto(title : Text, galleryImage : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add photos");
    };
    let timestamp = Time.now();
    let photo : Photo = {
      title;
      timestamp;
      galleryImage;
    };
    photos.add(title, photo);
  };

  // Music - only users can add
  public shared ({ caller }) func addMusicTrack(title : Text, audioFile : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add music tracks");
    };
    let timestamp = Time.now();
    let track : MusicTrack = {
      title;
      timestamp;
      audioFile;
    };
    music.add(title, track);
  };

  // Query functions - readable by authenticated users (not guests)
  public query ({ caller }) func getLoveMessage(title : Text) : async LoveMessage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view love messages");
    };
    switch (loveMessages.get(title)) {
      case (null) { Runtime.trap("Message not found") };
      case (?msg) { msg };
    };
  };

  public query ({ caller }) func getAllLoveMessages() : async [LoveMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view love messages");
    };
    loveMessages.values().toArray().sort(LoveMessage.compareByDate);
  };

  public query ({ caller }) func getAllMemories() : async [MemoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view memories");
    };
    memories.toArray().sort();
  };

  public query ({ caller }) func getPhoto(title : Text) : async ?Photo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view photos");
    };
    photos.get(title);
  };

  public query ({ caller }) func getMusicTrack(title : Text) : async ?MusicTrack {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view music tracks");
    };
    music.get(title);
  };
};

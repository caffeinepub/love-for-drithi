import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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
    // Add other fields if needed
  };

  // Internal persistent state
  let loveMessages = Map.empty<Text, LoveMessage>();
  let memories = List.empty<MemoryItem>();
  let photos = Map.empty<Text, Photo>();
  let music = Map.empty<Text, MusicTrack>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinStorage();

  // User profile management - PROTECTED
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Love messages - OPEN to all callers including anonymous
  public shared func addLoveMessage(title : Text, content : Text) : async () {
    let message = {
      title;
      date = Time.now();
      content;
    };
    loveMessages.add(title, message);
  };

  public query func getLoveMessage(title : Text) : async LoveMessage {
    switch (loveMessages.get(title)) {
      case (null) { Runtime.trap("Message not found") };
      case (?msg) { msg };
    };
  };

  public query func getAllLoveMessages() : async [LoveMessage] {
    loveMessages.values().toArray().sort(LoveMessage.compareByDate);
  };

  // Memories - OPEN to all callers including anonymous
  public shared func addMemory(name : Text, description : Text) : async () {
    let memory = {
      name;
      description;
    };
    memories.add(memory);
  };

  public query func getAllMemories() : async [MemoryItem] {
    memories.toArray().sort();
  };

  // Photos - OPEN to all callers including anonymous
  public shared func addPhoto(title : Text, galleryImage : Storage.ExternalBlob) : async () {
    let photo : Photo = {
      title;
      timestamp = Time.now();
      galleryImage;
    };
    photos.add(title, photo);
  };

  public query func getPhoto(title : Text) : async ?Photo {
    photos.get(title);
  };

  // Music tracks - OPEN to all callers including anonymous
  public shared func addMusicTrack(title : Text, audioFile : Storage.ExternalBlob) : async () {
    let track : MusicTrack = {
      title;
      timestamp = Time.now();
      audioFile;
    };
    music.add(title, track);
  };

  public query func getMusicTrack(title : Text) : async ?MusicTrack {
    music.get(title);
  };
};

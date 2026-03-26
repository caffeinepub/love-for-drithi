import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";

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
  };

  // Internal persistent state
  let loveMessages = Map.empty<Text, LoveMessage>();
  let memories = List.empty<MemoryItem>();
  let photos = Map.empty<Text, Photo>();
  let music = Map.empty<Text, MusicTrack>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextQuoteId = 1;
  type LoveQuote = {
    id : Nat;
    text : Text;
  };
  let loveQuotes = Map.empty<Nat, LoveQuote>();

  var appContent : ?Text = null;

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

  // Love Quotes - OPEN to all callers including anonymous
  public shared func addLoveQuote(text : Text) : async Nat {
    let id = nextQuoteId;
    nextQuoteId += 1;
    let quote : LoveQuote = {
      id;
      text;
    };
    loveQuotes.add(id, quote);
    id;
  };

  public query func getLoveQuote(id : Nat) : async LoveQuote {
    switch (loveQuotes.get(id)) {
      case (null) { Runtime.trap("Quote not found") };
      case (?quote) { quote };
    };
  };

  public query func getAllLoveQuotes() : async [LoveQuote] {
    loveQuotes.values().toArray();
  };

  public query func getRandomLoveQuote() : async LoveQuote {
    if (loveQuotes.isEmpty()) {
      Runtime.trap("No quotes available");
    };
    let quoteIter = loveQuotes.values();
    let quoteArray = quoteIter.toArray();
    let index = nextQuoteId % quoteArray.size();
    if (index < quoteArray.size()) {
      quoteArray[index];
    } else {
      Runtime.trap("Random index out of bounds");
    };
  };

  // App Content (Document Storage) - ADMIN ONLY for writes, open for reads
  public shared ({ caller }) func saveAppContent(jsonText : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save app content");
    };
    appContent := ?jsonText;
  };

  public query func getAppContent() : async ?Text {
    appContent;
  };
};

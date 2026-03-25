import Time "mo:core/Time";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
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

  let loveMessages = Map.empty<Text, LoveMessage>();
  let memories = List.empty<MemoryItem>();

  public shared ({ caller }) func addLoveMessage(title : Text, content : Text) : async () {
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

  public shared ({ caller }) func addMemory(name : Text, description : Text) : async () {
    let memory = {
      name;
      description;
    };
    memories.add(memory);
  };

  public query ({ caller }) func getLoveMessage(title : Text) : async LoveMessage {
    switch (loveMessages.get(title)) {
      case (null) { Runtime.trap("Message not found") };
      case (?msg) { msg };
    };
  };

  public query ({ caller }) func getAllLoveMessages() : async [LoveMessage] {
    loveMessages.values().toArray().sort(LoveMessage.compareByDate);
  };

  public query ({ caller }) func getAllMemories() : async [MemoryItem] {
    memories.toArray().sort();
  };
};

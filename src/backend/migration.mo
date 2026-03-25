import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";

module {
  type LoveMessage = {
    title : Text;
    date : Time.Time;
    content : Text;
  };

  type MemoryItem = {
    name : Text;
    description : Text;
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

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    loveMessages : Map.Map<Text, LoveMessage>;
    memories : List.List<MemoryItem>;
  };

  type NewActor = {
    loveMessages : Map.Map<Text, LoveMessage>;
    memories : List.List<MemoryItem>;
    photos : Map.Map<Text, Photo>;
    music : Map.Map<Text, MusicTrack>;
    userProfiles : Map.Map<Principal, UserProfile>;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    {
      loveMessages = old.loveMessages;
      memories = old.memories;
      photos = Map.empty<Text, Photo>();
      music = Map.empty<Text, MusicTrack>();
      userProfiles = Map.empty<Principal, UserProfile>();
      accessControlState = AccessControl.initState();
    };
  };
};

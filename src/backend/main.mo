import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";
import Float "mo:core/Float";

import Blob "mo:core/Blob";


actor {
  include MixinStorage();

  type AnimationEffect = { #rotate; #scale; #particle };
  type WorkflowMode = { #twoDimensional; #threeDimensional };

  type EffectConfig2D = { rotateIntensity : Float };
  type EffectConfig3D = { particleIntensity : Float };

  type RotationConfig2D = {
    angle : Float;
    speed : Float;
    axis : Text;
    frequency : Float;
    amplitude : Float;
  };

  type Position2D = (Float, Float);
  type Rotation2D = (Float, Float);
  type Scale2D = (Float, Float);

  type Keyframe2D = {
    time : Float;
    position : Position2D;
    rotation : Rotation2D;
    scale : Scale2D;
    intensity : Float;
  };

  type RotationConfig3D = {
    angle : Float;
    speed : Float;
    axis : Text;
    frequency : Float;
    amplitude : Float;
  };

  type Position3D = (Float, Float, Float);
  type Rotation3D = (Float, Float, Float);
  type Scale3D = (Float, Float, Float);

  type Keyframe3D = {
    time : Float;
    position : Position3D;
    rotation : Rotation3D;
    scale : Scale3D;
    intensity : Float;
  };

  public type AnimationProfile2D = {
    effects : [AnimationEffect];
    effectConfig2D : EffectConfig2D;
    rotationConfig : RotationConfig2D;
    keyframes : [Keyframe2D];
  };

  public type AnimationProfile3D = {
    effects : [AnimationEffect];
    effectConfig3D : EffectConfig3D;
    rotationConfig : RotationConfig3D;
    keyframes : [Keyframe3D];
  };

  public type LogoData = {
    id : Text;
    workflowMode : WorkflowMode;
    inputImage : Storage.ExternalBlob;
    modelFile : ?Storage.ExternalBlob;
    videoFile : ?Storage.ExternalBlob;
    animationProfile2D : AnimationProfile2D;
    animationProfile3D : AnimationProfile3D;
  };

  public type ResponsePayload = {
    effect : [LogoData];
    noEffect : [LogoData];
    rotation : [LogoData];
    scale : [LogoData];
    particle : [LogoData];
    noParticle : [LogoData];
  };

  let logoArrayMap = Map.empty<Nat, LogoData>();
  var animationProfile2D : AnimationProfile2D = {
    effects = [];
    effectConfig2D = { rotateIntensity = 0 };
    rotationConfig = {
      angle = 0.0;
      speed = 1.0;
      axis = "z";
      frequency = 1.0;
      amplitude = 1.0;
    };
    keyframes = [];
  };
  var animationProfile3D : AnimationProfile3D = {
    effects = [];
    effectConfig3D = { particleIntensity = 0 };
    rotationConfig = {
      angle = 0.0;
      speed = 1.0;
      axis = "z";
      frequency = 1.0;
      amplitude = 1.0;
    };
    keyframes = [];
  };

  public shared ({ caller }) func addLogo(logoId : Text, workflowMode : WorkflowMode, inputImage : Storage.ExternalBlob, modelFile : ?Storage.ExternalBlob, videoFile : ?Storage.ExternalBlob) : async () {
    addLogoInternal(logoId, workflowMode, inputImage, modelFile, videoFile, animationProfile2D, animationProfile3D);
  };

  func addLogoInternal(logoId : Text, workflowMode : WorkflowMode, inputImage : Storage.ExternalBlob, modelFile : ?Storage.ExternalBlob, videoFile : ?Storage.ExternalBlob, animationProfile2D : AnimationProfile2D, animationProfile3D : AnimationProfile3D) {
    let idCounter = if (logoArrayMap.isEmpty()) { 0 } else {
      switch (logoArrayMap.keys().max()) {
        case (?maxKey) { maxKey + 1 };
        case (null) { 0 };
      };
    };
    let logoData = {
      id = logoId;
      workflowMode;
      inputImage;
      modelFile;
      videoFile;
      animationProfile2D;
      animationProfile3D;
    };
    logoArrayMap.add(idCounter, logoData);
  };

  public query ({ caller }) func getLogoById(logoId : Text) : async LogoData {
    switch (logoArrayMap.values().find(func(item) { item.id == logoId })) {
      case (?logoData) { logoData };
      case (null) { Runtime.trap("Logo with id " # logoId # " not found") };
    };
  };

  public query ({ caller }) func getLogoByIndex(index : Nat) : async LogoData {
    switch (logoArrayMap.get(index)) {
      case (?logoData) { logoData };
      case (null) { Runtime.trap("Logo at index " # index.toText() # " not found") };
    };
  };

  public shared ({ caller }) func getExternalBlobTest() : async Text {
    await getImageFromWebSync();
  };

  public query ({ caller }) func getAllLogos() : async ?ResponsePayload {
    let logoArray = logoArrayMap.toArray();

    let noEffect = logoArray.filter(func(entry) { entry.1.animationProfile2D.effects.size() == 0 and entry.1.animationProfile3D.effects.size() == 0 });
    let effect = logoArray.filter(func(entry) { entry.1.animationProfile2D.effects.size() > 0 or entry.1.animationProfile3D.effects.size() > 0 });

    let noRotation = effect.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #rotate }) == null and
      entry.1.animationProfile3D.effects.find(func(e) { e == #rotate }) == null
    });
    let rotation = effect.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #rotate }) != null or
      entry.1.animationProfile3D.effects.find(func(e) { e == #rotate }) != null
    });

    let noScale = noRotation.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #scale }) == null and
      entry.1.animationProfile3D.effects.find(func(e) { e == #scale }) == null
    });
    let scale = noRotation.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #scale }) != null or
      entry.1.animationProfile3D.effects.find(func(e) { e == #scale }) != null
    });

    let noParticle = noScale.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #particle }) == null and
      entry.1.animationProfile3D.effects.find(func(e) { e == #particle }) == null
    });
    let particle = noScale.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #particle }) != null or
      entry.1.animationProfile3D.effects.find(func(e) { e == #particle }) != null
    });

    let arrayLength = logoArray.size();
    let responseArray1 = effect.map(func(entry) { entry.1 });
    let responseArray2 = noEffect.map(func(entry) { entry.1 });
    let responseArray3 = rotation.map(func(entry) { entry.1 });
    let responseArray4 = scale.map(func(entry) { entry.1 });
    let responseArray5 = particle.map(func(entry) { entry.1 });
    let responseArray6 = noParticle.map(func(entry) { entry.1 });

    if (arrayLength == 0) {
      null;
    } else {
      ?{
        effect = responseArray1;
        noEffect = responseArray2;
        rotation = responseArray3;
        scale = responseArray4;
        particle = responseArray5;
        noParticle = responseArray6;
      };
    };
  };

  public shared ({ caller }) func analyzeFile(fileType : Text, _blob : Storage.ExternalBlob) : async Text {
    "successfully analyzed file with type: " # fileType # " 👏 ";
  };

  public shared ({ caller }) func analyzeAnimation(_filepath : Storage.ExternalBlob, _animation_type : Text) : async Text {
    "successfully analyzed animation";
  };

  public shared ({ caller }) func addAnimationProfile(logoId : Text, effects2D : [AnimationEffect], effectConfig2D : EffectConfig2D, rotationConfig2D : RotationConfig2D, keyframes2D : [Keyframe2D], effects3D : [AnimationEffect], effectConfig3D : EffectConfig3D, rotationConfig3D : RotationConfig3D, keyframes3D : [Keyframe3D]) : async Text {
    let (_logoId_int, logoData) = switch (logoArrayMap.toArray().find(func(entry) { entry.1.id == logoId })) {
      case (?entry) { entry };
      case (null) { Runtime.trap("Logo with id " # logoId # " not found") };
    };

    let animationProfile2D = {
      effects = effects2D;
      effectConfig2D;
      rotationConfig = rotationConfig2D;
      keyframes = keyframes2D;
    };

    let animationProfile3D = {
      effects = effects3D;
      effectConfig3D;
      rotationConfig = rotationConfig3D;
      keyframes = keyframes3D;
    };

    let updatedLogoData : LogoData = {
      logoData with
      animationProfile2D;
      animationProfile3D;
    };

    let kvArray = logoArrayMap.toArray();
    if (kvArray.size() > 0) {
      logoArrayMap.add(kvArray[0].0, updatedLogoData);
    };
    "Added animation profile to logo with id: " # logoId;
  };

  public query ({ caller }) func filterAnimationProfiles(filterType : Text) : async ResponsePayload {
    let logoArray = logoArrayMap.toArray();

    let effectFilter = logoArray.filter(func(entry) {
      entry.1.animationProfile2D.effects.size() > 0 or
      entry.1.animationProfile3D.effects.size() > 0
    });
    let rotationFilter = logoArray.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #rotate }) != null or
      entry.1.animationProfile3D.effects.find(func(e) { e == #rotate }) != null
    });
    let scaleFilter = logoArray.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #scale }) != null or
      entry.1.animationProfile3D.effects.find(func(e) { e == #scale }) != null
    });
    let particleFilter = logoArray.filter(func(entry) {
      entry.1.animationProfile2D.effects.find(func(e) { e == #particle }) != null or
      entry.1.animationProfile3D.effects.find(func(e) { e == #particle }) != null
    });

    let responseArray1 = effectFilter.map(func(entry) { entry.1 });
    let responseArray2 = rotationFilter.map(func(entry) { entry.1 });
    let responseArray3 = scaleFilter.map(func(entry) { entry.1 });
    let responseArray4 = particleFilter.map(func(entry) { entry.1 });

    switch (filterType) {
      case ("effect") {
        {
          effect = responseArray1;
          noEffect = [];
          rotation = [];
          scale = [];
          particle = [];
          noParticle = [];
        };
      };
      case ("noEffect") {
        {
          effect = [];
          noEffect = responseArray1;
          rotation = [];
          scale = [];
          particle = [];
          noParticle = [];
        };
      };
      case ("rotation") {
        {
          effect = [];
          noEffect = [];
          rotation = responseArray2;
          scale = [];
          particle = [];
          noParticle = [];
        };
      };
      case ("scale") {
        {
          effect = [];
          noEffect = [];
          rotation = [];
          scale = responseArray3;
          particle = [];
          noParticle = [];
        };
      };
      case ("particle") {
        {
          effect = [];
          noEffect = [];
          rotation = [];
          scale = [];
          particle = responseArray4;
          noParticle = [];
        };
      };
      case ("noParticle") {
        {
          effect = [];
          noEffect = [];
          rotation = [];
          scale = [];
          particle = [];
          noParticle = responseArray4;
        };
      };
      case (_type) {
        {
          effect = [];
          noEffect = [];
          rotation = [];
          scale = [];
          particle = [];
          noParticle = [];
        };
      };
    };
  };

  public shared ({ caller }) func autoAddAnimationProfile(logoId : Text) : async Text {
    switch (logoArrayMap.values().find(func(item) { item.id == logoId })) {
      case (?_) { "Automated creation of animation profile for logo `" # logoId # "` completed successfully." };
      case (null) { Runtime.trap("Error while adding effects: Logo with id " # logoId # " does not exist!") };
    };
  };

  public query ({ caller }) func getAllAnimationProfiles2D() : async [AnimationProfile2D] {
    let animationProfiles2D = logoArrayMap.values().toArray().map(func(logoData) { logoData.animationProfile2D });
    animationProfiles2D;
  };

  public query ({ caller }) func getAllAnimationProfiles3D() : async [AnimationProfile3D] {
    let animationProfiles3D = logoArrayMap.values().toArray().map(func(logoData) { logoData.animationProfile3D });
    animationProfiles3D;
  };

  public query ({ caller }) func getWorkflowModeById(logoId : Text) : async WorkflowMode {
    switch (logoArrayMap.values().find(func(item) { item.id == logoId })) {
      case (?logoData) { logoData.workflowMode };
      case (null) { Runtime.trap("Error: Logo with id " # logoId # " not found") };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func getImageFromWebSync() : async Text {
    try {
      let url : Text = "https://shapescape.io/images/screenshot1.png";
      // Prepare headers for async request.
      let headers = [
        { name = "Content-Type"; value = "application/json" },
      ];

      let response = await OutCall.httpGetRequest(url, headers, transform);
      response;
    } catch (_) {
      "Error in getImageFromWebSync: ";
    };
  };
};

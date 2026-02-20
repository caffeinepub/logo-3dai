import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Rotation2D = [number, number];
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Keyframe2D {
    rotation: Rotation2D;
    time: number;
    scale: Scale2D;
    position: Position2D;
    intensity: number;
}
export type Position2D = [number, number];
export interface AnimationProfile2D {
    keyframes: Array<Keyframe2D>;
    effects: Array<AnimationEffect>;
    effectConfig2D: EffectConfig2D;
    rotationConfig: RotationConfig2D;
}
export interface ResponsePayload {
    rotation: Array<LogoData>;
    noEffect: Array<LogoData>;
    noParticle: Array<LogoData>;
    effect: Array<LogoData>;
    particle: Array<LogoData>;
    scale: Array<LogoData>;
}
export interface Keyframe3D {
    rotation: Rotation3D;
    time: number;
    scale: Scale3D;
    position: Position3D;
    intensity: number;
}
export type Position3D = [number, number, number];
export interface http_header {
    value: string;
    name: string;
}
export type Rotation3D = [number, number, number];
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AnimationProfile3D {
    keyframes: Array<Keyframe3D>;
    effects: Array<AnimationEffect>;
    effectConfig3D: EffectConfig3D;
    rotationConfig: RotationConfig3D;
}
export interface LogoData {
    id: string;
    animationProfile2D: AnimationProfile2D;
    animationProfile3D: AnimationProfile3D;
    inputImage: ExternalBlob;
    videoFile?: ExternalBlob;
    modelFile?: ExternalBlob;
    workflowMode: WorkflowMode;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface RotationConfig3D {
    angle: number;
    axis: string;
    amplitude: number;
    speed: number;
    frequency: number;
}
export interface EffectConfig3D {
    particleIntensity: number;
}
export interface RotationConfig2D {
    angle: number;
    axis: string;
    amplitude: number;
    speed: number;
    frequency: number;
}
export interface EffectConfig2D {
    rotateIntensity: number;
}
export type Scale3D = [number, number, number];
export type Scale2D = [number, number];
export enum AnimationEffect {
    particle = "particle",
    scale = "scale",
    rotate = "rotate"
}
export enum WorkflowMode {
    threeDimensional = "threeDimensional",
    twoDimensional = "twoDimensional"
}
export interface backendInterface {
    addAnimationProfile(logoId: string, effects2D: Array<AnimationEffect>, effectConfig2D: EffectConfig2D, rotationConfig2D: RotationConfig2D, keyframes2D: Array<Keyframe2D>, effects3D: Array<AnimationEffect>, effectConfig3D: EffectConfig3D, rotationConfig3D: RotationConfig3D, keyframes3D: Array<Keyframe3D>): Promise<string>;
    addLogo(logoId: string, workflowMode: WorkflowMode, inputImage: ExternalBlob, modelFile: ExternalBlob | null, videoFile: ExternalBlob | null): Promise<void>;
    analyzeAnimation(_filepath: ExternalBlob, _animation_type: string): Promise<string>;
    analyzeFile(fileType: string, _blob: ExternalBlob): Promise<string>;
    autoAddAnimationProfile(logoId: string): Promise<string>;
    filterAnimationProfiles(filterType: string): Promise<ResponsePayload>;
    getAllAnimationProfiles2D(): Promise<Array<AnimationProfile2D>>;
    getAllAnimationProfiles3D(): Promise<Array<AnimationProfile3D>>;
    getAllLogos(): Promise<ResponsePayload | null>;
    getExternalBlobTest(): Promise<string>;
    getLogoById(logoId: string): Promise<LogoData>;
    getLogoByIndex(index: bigint): Promise<LogoData>;
    getWorkflowModeById(logoId: string): Promise<WorkflowMode>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}

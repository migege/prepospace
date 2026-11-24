import { ScenePresetId } from '../types/course';
import { BuiltScene } from './helpers';
import { buildHeroTrio, buildSpatialScene } from './spatialScenes';
import { buildMotionScene } from './motionScenes';
import { buildTimelineScene } from './timelineScenes';
import { buildNuanceScene } from './nuanceScenes';
import { buildChunkAndParticleScene } from './chunkAndParticleScenes';

export function buildSceneById(sceneId: ScenePresetId): BuiltScene {
  return (
    buildSpatialScene(sceneId) ??
    buildMotionScene(sceneId) ??
    buildTimelineScene(sceneId) ??
    buildNuanceScene(sceneId) ??
    buildChunkAndParticleScene(sceneId) ??
    buildHeroTrio()
  );
}

<script setup lang="ts">
/**
 * The request map turned sideways, with the real names from
 * checkpoint-4-m2m in each layer (plan slide 42). Names appear on click `at`.
 */
withDefaults(defineProps<{ at?: number | false }>(), { at: 1 })

const LAYERS = [
  { name: 'Client', file: 'browser, curl', code: [] as string[] },
  { name: 'URL router', file: 'config/urls.py', code: ['DefaultRouter'] },
  { name: 'ViewSet', file: 'views.py', code: ['QuestionViewSet', 'get_permissions', 'toggle_vote'] },
  { name: 'Serializer', file: 'serializers.py', code: ['QuestionSerializer'] },
  { name: 'Model', file: 'models.py', code: ['Question'] },
  { name: 'SQLite', file: 'db.sqlite3', code: ['questions_question', 'questions_question_votes'] },
]
</script>

<template>
  <div class="built-map">
    <template v-for="(l, i) in LAYERS" :key="l.name">
      <div class="layer">
        <div class="box">
          <span class="name">{{ l.name }}</span>
          <span class="file">{{ l.file }}</span>
        </div>
        <div v-if="l.code.length" v-click="at" class="code">
          <code v-for="c in l.code" :key="c">{{ c }}</code>
        </div>
      </div>
      <div v-if="i < LAYERS.length - 1" class="arrow" aria-hidden="true" />
    </template>
  </div>
</template>

<style scoped>
.built-map {
  display: flex;
  flex-direction: column;
}
.layer {
  display: flex;
  align-items: center;
  gap: 26px;
}
.box {
  box-sizing: border-box;
  width: 330px;
  height: 46px;
  padding: 0 12px;
  border: var(--stroke-w) solid var(--stroke);
  border-radius: 5px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  line-height: 42px;
}
.name {
  font-size: 19px;
  font-weight: 650;
}
.file {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  color: var(--text-2);
}
.code {
  display: flex;
  gap: 18px;
}
code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 600;
  color: var(--accent);
}
.arrow {
  position: relative;
  width: var(--stroke-w);
  height: 14px;
  margin-left: 164px;
  background: var(--stroke);
}
.arrow::after {
  content: '';
  position: absolute;
  left: -5px;
  bottom: -6px;
  border: 6px solid transparent;
  border-top: 7px solid var(--stroke);
  border-bottom: 0;
}
</style>

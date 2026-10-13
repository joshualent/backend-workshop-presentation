<script setup lang="ts">
/**
 * How DRF picks the permission for a request in checkpoint-3-auth's
 * QuestionViewSet, top to bottom in the order the code checks it.
 * Built in the order the lesson tells it: the default (always shown),
 * then get_permissions() (click 1), then the actions' own classes (click 2).
 */
const ROWS = [
  {
    at: 1,
    ask: 'update, partial_update, or destroy?',
    where: 'get_permissions()',
    result: [{ perm: 'IsAdminUser', note: 'staff only' }],
  },
  {
    at: 2,
    ask: 'an @action with permission_classes?',
    where: '@action(permission_classes=…)',
    result: [{ label: 'upvote', perm: 'IsAuthenticated' }, { label: 'toggle_answered', perm: 'IsAdminUser' }],
  },
  {
    at: false,
    ask: 'anything else: list, create, retrieve',
    where: 'permission_classes = [AllowAny]',
    result: [{ perm: 'AllowAny', note: 'anyone' }],
  },
] as const
</script>

<template>
  <div class="flow">
    <div class="start">
      A request reaches <code>QuestionViewSet</code>
    </div>
    <template v-for="(r, i) in ROWS" :key="i">
      <div v-click="r.at" class="row">
        <div class="down" aria-hidden="true">
          <span v-if="i > 0">no</span>
        </div>
        <div class="ask">
          <div class="q">
            {{ r.ask }}
          </div>
          <div class="where">
            {{ r.where }}
          </div>
        </div>
        <div class="yes" aria-hidden="true">
          <span>{{ i < 2 ? 'yes' : '' }}</span>
        </div>
        <div class="result">
          <div v-for="p in r.result" :key="p.perm + ('label' in p ? p.label : '')" class="perm">
            <code v-if="'label' in p" class="label">{{ p.label }}</code>
            <code class="cls">{{ p.perm }}</code>
            <span v-if="'note' in p" class="note">{{ p.note }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.flow {
  display: flex;
  flex-direction: column;
  gap: 0;
  font-size: var(--fs-small);
}
.start {
  color: var(--text-2);
  margin-bottom: 6px;
}
code {
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  font-weight: 600;
  color: var(--text);
}
.row {
  display: grid;
  grid-template-columns: 34px 456px 60px 1fr;
  align-items: center;
}
.down {
  align-self: stretch;
  position: relative;
  border-left: var(--stroke-w) solid var(--stroke);
  margin-left: 14px;
}
.down span {
  position: absolute;
  top: 2px;
  left: 6px;
  font-size: var(--fs-label);
  color: var(--text-2);
}
.ask {
  border: var(--stroke-w) solid var(--stroke);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  margin: 10px 0;
}
.q {
  font-size: 21px;
  font-weight: var(--fw-strong);
  line-height: 1.25;
  white-space: nowrap;
}
.where {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  color: var(--text-2);
  margin-top: 2px;
}
.yes {
  position: relative;
  height: var(--stroke-w);
  background: var(--stroke);
  margin-right: 8px;
}
.yes::after {
  content: '';
  position: absolute;
  right: -8px;
  top: -5px;
  border: 6px solid transparent;
  border-left: 8px solid var(--stroke);
  border-right: 0;
}
.yes span {
  position: absolute;
  top: -24px;
  left: 14px;
  font-size: var(--fs-label);
  color: var(--text-2);
}
.result {
  padding-left: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.perm {
  display: flex;
  gap: 10px;
  align-items: baseline;
}
.label {
  color: var(--text-2);
  font-weight: 500;
}
.cls {
  font-weight: 700;
}
.note {
  color: var(--text-2);
}
</style>

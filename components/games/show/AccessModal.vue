<template>
  <draggable-dialog
    :on-close="close"
    title="Доступы"
    :width="325"
    height="auto"
  >
    <template v-slot:body>
      <div v-if="!loaded" class="loaded">
        <loader />
      </div>
      <v-row v-else align="center" justify="center">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Игрок</th>
              <th class="text-left">Просмотр</th>
              <th class="text-left">Изменение</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(record, index) in acl.levels" :key="record.user.id">
              <td>{{ record.user.nickname }}</td>
              <template v-if="record.owner" class="owner-grid">
                <td>Владелец</td>
              </template>
              <template v-else class="user-grid">
                <td>
                  <v-checkbox
                    color="indigo"
                    :input-value="record.read"
                    @change="changePermission(`levels[${index}].read`, !record.read)"
                  />
                </td>
                <td>
                  <v-checkbox
                    color="indigo"
                    :input-value="record.write"
                    @change="changePermission(`levels[${index}].write`, !record.write)"
                  />
                </td>
              </template>
            </tr>

            <tr>
              <td>Все</td>
              <td>
                <v-checkbox
                  color="indigo"
                  :input-value="acl.read_all"
                  @change="changePermission('read_all', !acl.read_all)"
                />
              </td>
              <td>
                <v-checkbox
                  color="indigo"
                  :input-value="acl.write_all"
                  @change="changePermission('write_all', !acl.write_all)"
                />
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
    </template>
    <template v-slot:actions>
      <v-btn
        dark
        color="indigo"
        @click="close"
      >
        Закрыть
      </v-btn>
      <v-spacer />
      <v-btn
        dark
        color="indigo"
        @click="save"
      >
        <span :class="{ whiteText: isValid }">Изменить</span>
      </v-btn>
    </template>
  </draggable-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { set } from 'lodash'

  import Loader from '../../Loader'
  import { AclUsers } from '@/api/acl'
  import DraggableDialog from '@/components/games/show/DraggableDialog'

  export default {
    name: 'AccessModal',

    components: { DraggableDialog, Loader },

    props: {
      uniqKey: { type: Number, required: true },
      obj: { type: Object, required: true },
    },

    data() {
      return {
        newObjName: this.obj.name,
        acl: {},
        loaded: false,
      }
    },

    computed: {
      ...mapState({
        currentUser: state => state.game.currentUser,
        game: state => state.game.info,
      }),

      isValid() {
        return this.name && this.name !== ''
      },

      name: {
        get() {
          return this.newObjName
        },
        set(value) {
          this.newObjName = value
        },
      },
    },

    created() {
      AclUsers({ axios: this.$axios, params: this.obj }).then(acl => {
        this.acl = acl
        this.loaded = true
      })
    },

    methods: {
      changePermission(path, value) {
        set(this.acl, path, value)
      },

      close() {
        this.loaded = false
        this.acl = {}
        this.$store.commit('game/removeOpenModal', this.uniqKey)
      },

      save() {
        const data = { ...this.acl, type: this.obj.type }
        data.levels = data.levels.map(level => ({ ...level, user: null, user_id: level.user.id }))
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change_access',
          data,
        })

        this.close()
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .whiteText {
    color: $white;
  }
</style>


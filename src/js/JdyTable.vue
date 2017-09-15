<template>
<v-layout row justify-center>
    <v-dialog v-model="isEditDialogVisible">
      <v-card>
        <v-card-row>
          <v-card-title>Edit Object</v-card-title>
        </v-card-row>
        <v-card-row>          
            <v-card-text>
                <v-text-field v-for="jdycolumn in columns" v-bind:key="jdycolumn.text" :label="jdycolumn.text" 
                    v-bind:value="getItemValue(jdycolumn.value)" v-on:input="updateItemValue(jdycolumn.value, $event)"></v-text-field>
            </v-card-text>    
        </v-card-row>
        <v-card-row actions>
          <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Agree</v-btn>
          <v-btn class="green--text darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
  <v-data-table   v-bind:headers="headers"  :items="items"   hide-actions  class="elevation-1">
    <template slot="items" scope="props">
        <td>
             <v-layout row wrap>
                <v-flex xs6>
                <v-btn icon class="indigo--text" @click.native="editInDialog(props.item, $event)"><v-icon>edit</v-icon></v-btn>
                </v-flex> 
                <v-flex xs6>
                <v-btn icon class="indigo--text" @click.native="deleteItem(props.item, $event)"><v-icon>delete</v-icon></v-btn>
                </v-flex> 
            </v-layout>
        </td>
        <td v-bind:class="[header.left ? '' : 'text-xs-right']" v-for="header in columns">
            {{ header.value(props.item)}}
        </td>
    </template>
  </v-data-table>
  </v-layout>

</template>

<script>
  var columns = [
          {
            text: 'Dessert (100g serving)',
            left: true,
            sortable: false,
            value: item => item['name']
          },
          { text: 'Calories', value: item => item['calories']},
          { text: 'Fat (g)', value: item => item['fat'] },
          { text: 'Carbs (g)', value: item => item['carbs'] },
          { text: 'Protein (g)', value: item => item['protein'] },
          { text: 'Sodium (mg)', value: item => item['sodium'] },
          { text: 'Calcium (%)', value: item => item['calcium'] },
          { text: 'Iron (%)', value: item => item['iron'] }
    ];  
  var editHeader = [
        {
            text: 'Edit',
            left: true,
            sortable: false,
            value: item => ''
          },
    ];

   var selectedItem;

  export default {
    data () {
      return {
        isEditDialogVisible: false,
        columns: columns,
        headers: editHeader.concat(columns),
        selectedItem: null
      }
    }, 
    props: ['items'],
    methods: {
      editInDialog: function (listItem, event) {
        // `this` inside methods points to the Vue instance
        this.isEditDialogVisible = true;
        this.selectedItem = listItem
        console.log('Hello ' + listItem.name + '!');
      },
      deleteItem: function (listItem, event) {
        // `this` inside methods points to the Vue instance
        console.log('Delete ' + listItem.name + '!');
        this.items.splice(this.items.findIndex(x => x.name === listItem.name),1);
      },
      getItemValue: function(value) {
        return this.selectedItem ? value(this.selectedItem) : null;
      },
      updateItemValue: function(value, newValue) {

        console.log('Selected Item ' + selectedItem + '!');
        console.log('Value ' + value + '!');
        console.log('New Value ' + newValue + '!');

        if (this.selectedItem) {
             this.selectedItem[value] = newValue;
        }
      }

    }
  }
</script>

<template>
    <v-card-row>   
        <form>       
        <v-card-text>
            <v-text-field v-for="formfield in formfields" v-bind:key="formfield.text" :label="formfield.text" 
                :counter="10" :error-messages="errors.collect(formfield.text)"
                v-validate="'required|max:10'" data-vv-name=formfield.text
                v-bind:value="getItemValue(formfield.value)" v-on:input="updateItemValue(formfield.text, $event)">
            </v-text-field>
        </v-card-text>    
        </form>       
    </v-card-row>

</template>

<script>
 
    function primitiveTypeToColumnHandler(attrInfo) {

	return {
            handleBoolean: function (aType) {
                    return { text: attrInfo.getInternalName(), value: item => item[attrInfo.getInternalName()]};
            },

            handleDecimal: function (aType) {
                    return { text: attrInfo.getInternalName(), value: item => item[attrInfo.getInternalName()]};
            },

            handleTimeStamp: function (aType) {
                    return { text: attrInfo.getInternalName(), value: item => item[attrInfo.getInternalName()]};
            },

            handleFloat: function (aType) {
                    return { text: attrInfo.getInternalName(), value: item => item[attrInfo.getInternalName()]};
            },

            handleLong: function (aType) {

                    return { text: attrInfo.getInternalName(), value: item => item[attrInfo.getInternalName()]};
            },

            handleText: function (aType) {
                    return { text: attrInfo.getInternalName(), value: item => item[attrInfo.getInternalName()]};
            },

            handleVarChar: function (aType) {
                    return null;
            },

            handleBlob: function (aType) {
                    return null;
            }
	};
    };

    function convertToFields (classInfo) {

        const allFields = [];
        classInfo.forEachAttr(attrInfo => {
            if (attrInfo.isPrimitive()) {
                let newField = attrInfo.getType().handlePrimitiveKey(primitiveTypeToColumnHandler(attrInfo));
                if(newField) {
                    allFields.push(newField);
                }
            }
        });
        return allFields;
    };

  export default {
    data () {
      return {
        formfields: []
      }
    }, 
    props: ['selectedItem', 'classinfo'],
    computed: {
    },
    methods: {

      getItemValue: function(value) {
        const result = this.selectedItem ? value(this.selectedItem) : null;
        return result;
      },
      updateItemValue: function(value, newValue) {

        if (this.selectedItem) {
            console.log('Selected Item ' + this.selectedItem + '!');
            console.log('Value ' + value + '!');
            console.log('New Value ' + newValue + '!');
            this.selectedItem[value] = newValue;
        }
      }
    },
    props: ['classinfo'],
        watch: {
          // whenever question changes, this function will run
          classinfo: function (newClassInfo) {

                if (newClassInfo) {
                    this.formfields = convertToFields(newClassInfo);
                } else {
                    this.formfields = undefinedColumns;
                }
           }
        }
  }
</script>

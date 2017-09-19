<template>
    <jdy-table :items="holderItems" :columns="columns"></jdy-table>
</template>

<script>

 function primitiveTypeToColumnHandler(attrInfo) {

	return {
            handleBoolean: function (aType) {
                    return { text: attrInfo.getInternalName(), align:'left', value: item => item[attrInfo.getInternalName()], left: true};
            },

            handleDecimal: function (aType) {
                    return { text: attrInfo.getInternalName(), align:'left', value: item => item[attrInfo.getInternalName()]};
            },

            handleTimeStamp: function (aType) {
                    return { text: attrInfo.getInternalName(), align:'left', value: item => item[attrInfo.getInternalName()]};
            },

            handleFloat: function (aType) {
                    return { text: attrInfo.getInternalName(), align:'left', value: item => item[attrInfo.getInternalName()]};
            },

            handleLong: function (aType) {

                    return { text: attrInfo.getInternalName(), align:'left', value: item => item[attrInfo.getInternalName()]};
            },

            handleText: function (aType) {
                    return { text: attrInfo.getInternalName(), align:'left', value: item => item[attrInfo.getInternalName()],left: true };
            },

            handleVarChar: function (aType) {
                    return null;
            },

            handleBlob: function (aType) {
                    return null;
            }
	};
    };

    function convertToColumns (classInfo) {

        const allColumns = [];
        classInfo.forEachAttr(attrInfo => {
            if (attrInfo.isPrimitive()) {
                let newCol = attrInfo.getType().handlePrimitiveKey(primitiveTypeToColumnHandler(attrInfo));
                if(newCol) {
                    allColumns.push(newCol);
                }
            }
        });
        return allColumns;
    };

    const undefinedColumns = 
                [    {
                      text: '#Undefined',
                      left: true,
                      sortable: false,
                      value: item => item['BotanicName']
                    }
              ];

    const undefinedData = [
        {
            "#Undefined": "#Undefined",
        }
    ];

    export default {
      data () {
        return {
          msg: 'Hello world!', 
          columns: undefinedColumns,
          holderItems: undefinedData
        }
      },
      props: ['classinfo'],
        watch: {
          // whenever question changes, this function will run
          classinfo: function (newClassInfo) {

                if (newClassInfo) {
                    this.columns = convertToColumns(newClassInfo);
                    var myRequest = new Request('assets/' + newClassInfo.internalName + '.json');
                    fetch(myRequest)
                      .then(response => response.json())
                      .then(data => this.holderItems = data);
                } else {
                    this.columns = undefinedColumns;
                    this.holderItems = undefinedData;
                }
           }
        }
    }
</script>
 
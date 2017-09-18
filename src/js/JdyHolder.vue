<template>
    <jdy-table :items="holderItems" :columns="columns"></jdy-table>
</template>

<script>

    const testColumns = {
        data1: [
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
              ],
        data2: [
                    {
                      text: 'Dessert (100g serving)',
                      left: true,
                      sortable: false,
                      value: item => item['name']
                    },
                    { text: 'Calories', value: item => item['calories']},
                    { text: 'Fat (g)', value: item => item['fat'] },
        ],
        data3: [
                    {
                      text: 'Dessert (100g serving)',
                      left: true,
                      sortable: false,
                      value: item => item['name']
                    },
                    { text: 'Sodium (mg)', value: item => item['sodium'] },
                    { text: 'Calcium (%)', value: item => item['calcium'] },
                    { text: 'Iron (%)', value: item => item['iron'] }
        ]
    };
    const testData = [
        {
            "value": false,
            "name": "Frozen Yogurt",
            "calories": 159,
            "fat": 6.0,
            "carbs": 24,
            "protein": 4.0,
            "sodium": 87,
            "calcium": "14%",
            "iron": "1%"
        },
        {
            "value": false,
            "name": "Ice cream sandwich",
            "calories": 237,
            "fat": 9.0,
            "carbs": 37,
            "protein": 4.3,
            "sodium": 129,
            "calcium": "8%",
            "iron": "1%"
        }];

    export default {
      data () {
        return {
          msg: 'Hello world!', 
          columns: testColumns.data1,
          holderItems: testData
        }
      },
      props: ['classinfo'],
        watch: {
          // whenever question changes, this function will run
          classinfo: function (newClassInfo) {

               this.columns = testColumns[newClassInfo];
               var myRequest = new Request('assets/' + newClassInfo + '.json');
               fetch(myRequest)
                 .then(response => response.json())
                 .then(data => this.holderItems = data);
          }
        }
    }
</script>
 
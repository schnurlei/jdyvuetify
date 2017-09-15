<template>
    <jdy-table :items="holderItems"></jdy-table>
</template>

<script>

    export default {
      data () {
        return {
          msg: 'Hello world!',  
          holderItems: []
        }
      },
      props: ['classinfo'],
        watch: {
          // whenever question changes, this function will run
          classinfo: function (newClassInfo) {

               var myRequest = new Request('assets/' + newClassInfo + '.json');
               fetch(myRequest)
                 .then(response => response.json())
                 .then(data => this.holderItems = data);
          }
        }
    }
</script>
 
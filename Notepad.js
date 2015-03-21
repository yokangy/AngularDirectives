var app = angular.module('app', []);

app.directive('notepad', function(notesFactory){
  return {
    restrict: 'AE',
    scope: {},
    link: function(scope, elem, attrs){

      scope.restore = function(){
        scope.editMode = false;
        scope.index = -1;
        scope.noteText = '';
      };

      scope.openEditor = function(index){
        console.log(index)
        scope.editMode = true;

        if(index !== undefined){
          scope.noteText = notesFactory.get(index).content;
          scope.index = index;
        } else {
          scope.noteText = undefined;
        }
      };

      scope.save = function() {
        if(scope.noteText !== ''){
          var note = {};

          note.title = scope.noteText.length > 10 ? scope.noteText.substring(0, 10) + '...' : scope.noteText;
          note.content = scope.noteText;
          note.id = scope.index !== -1 ? scope.index : localStorage.length;
          scope.notes = notesFactory.put(note);
        }

        scope.restore();
      };

      var editor = elem.find('#editor');

      scope.restore();
      scope.notes = notesFactory.getAll();

      editor.bind('keyup keydown', function(){
        scope.noteText = editor.text().trim();
      });
    },
    templateUrl: 'notepad.html'
  };
});

app.factory('notesFactory', function(){
  var get = function(index){
    return JSON.parse(localStorage.getItem('note' + index));
  };

  var getAll = function(){
    notes = [];
    for(var i = 0; i < localStorage.length; i++){
      if(localStorage.key(i).indexOf('note') !== -1){
        notes.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }
    return notes;
  };

  var put = function(note){
    localStorage.setItem('note' + note.id, JSON.stringify(note));
    return this.getAll();
  };

  return {
    get: get,
    getAll: getAll,
    put: put
  }
});

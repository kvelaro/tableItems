Table items simple JS module 

itemTable must be something like ```<div class="item-table"></div>```
```
selector: selector, //parent selector
debuggy: true/false, //if additional information should be printed out
data: [], //data to pass to build table, {name, count} array of objects should be passed 
addModalID: 'add-modal', //add modal ID
addModalContent: '<p>Modal sample text</p>', //add modal contents
editModalID: 'edit-modal', //edit modal ID
editModalContent: '<p>Modal sample text</p>' //edit modal contents
```

```
 document.addEventListener('DOMContentLoaded', function() {
            let itemTable = document.querySelector('.item-table');
            let table = tableItems({
                data: [
                    {name: 'qwerty', count: 1},
                    {name: 'qwerty2', count: 2},
                    {name: 'qwerty3', count: 3},
                ],
                selector: itemTable,
                debuggy: true,
                addModalContent: `<label>select something</label>
                                    <select>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    </select>`
            });

            table.on('tableItem.ready', function() {
                console.log('initialized in user end')
            })
            table.on('click', () => {
                console.log('click handler in user end')
            })
            itemTable.insertAdjacentHTML('beforeend', table.draw());
        });
```

``
Simple to use, simple to learn modular wtiting in JS
Enjoy :) 
``
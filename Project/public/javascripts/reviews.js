<script>
$('.toggle-edit-form').on('click', function(){

    $(this).text() === 'Edit' ?  $(this).text('Cancel') : $(this).text('Edit');

    $(this).siblings('.edit-review-form').toggle();
});
</script>


//Need to move
<script>
$('clear-rating').click(function(){
    $(this).siblings('input-no-rate').click();
});
</script>
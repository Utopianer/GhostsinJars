$(function() {
    let selectionsJSON = null;

    function imagePreview(trait) {
        if (!trait.id) {
            return trait.text;
        }

        let baseUrl = '/assets/traits',
            $state = $(
                '<span><img src="' + baseUrl + '/' + trait.element.parentNode.name + '/collection' + trait.element.value.toLowerCase() + '.png" class="select-thumb" /> ' + trait.text + '</span>'
            );

        return $state;
    }
    
    $('#trait-picker select').each(function() {
        let trait = $(this).attr('name'),
            placeholder = 'Choose a ' + trait;

        $(this).select2({
            width: '100%',
            placeholder: placeholder,
            minimumResultsForSearch: -1,
            templateResult: imagePreview
        });
    });

    $('#trait-picker select').change(function() {
        let trait = $(this).attr('name'),
            value = $(this).val();

        $('img', '.trait-cont.' + trait).attr('src', '/assets/traits/' + trait + '/collection' + value + '.png');

        // Clone to larger hidden canvas
        $('#image-final').html('');
        $('#image-builder').children().clone().appendTo('#image-final');
    });

    function randomSelections() {
        
        $('#trait-picker select').each(function() {
            let $this = $(this),
                options = $('option:not(:disabled)', $this),
                random = Math.floor(options.length * (Math.random() % 1)),
                randomVal = $('option:not(:disabled)', $this).eq(random).val();

            $this.val(randomVal).trigger('change');
        });

    }
    randomSelections();

    function saveAs(uri, filename) {
        let link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }

    function generateCanvas(element) {
        const canvas = document.createElement('canvas')
        canvas.width = element.offsetWidth * devicePixelRatio, canvas.height = element.offsetHeight * devicePixelRatio
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = false

        // Create canvas and open save dialog
        html2canvas(element, {
            canvas:canvas
        }).then(canvas => {
            saveAs(canvas.toDataURL('image/webp-lossless', 1), new Date().getUTCMilliseconds() + '.webp');
        });
    }

    $('#download-image').click(function(e) {
        e.preventDefault();
        // Generate JSON of selections
        const data = new FormData($('#trait-picker')[0]);
        selectionsJSON = Object.fromEntries(data.entries());

        // Generate image
        generateCanvas(document.getElementById('image-final'));
    });

    $('#randomize').click(function(e) {
        e.preventDefault();
        randomSelections();
    });
});
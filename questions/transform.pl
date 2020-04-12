#/usr/bin/env perl
# this script will transform 8values-like js into json
use v5.24;

use JSON::PP;

my $json = JSON::PP->new->canonical(1);

my $questions = decode_json do {local $/; <>}; # read entire file

my $output = {};
$output->{"model"} = "default";
$output->{"name"} = "default";
$output->{"questions"} = [];

for my $question (@$questions) {
    push $output->{"questions"}->@*, {
        "text" => $question->{"question"},
        "evaluation" => [
            $question->{"effect"}->{"econ"},
            $question->{"effect"}->{"dipl"},
            $question->{"effect"}->{"govt"},
            $question->{"effect"}->{"scty"},
            $question->{"effect"}->{"envo"},
        ]
    };
}

print $json->encode( $output );

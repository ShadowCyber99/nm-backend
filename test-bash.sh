#!/bin/bash

book="black hat bash"
echo "Name of the book is ${book}"
PUBLISHER="No Starch Press"
print_name(){
 local name
 name="Black Hat Bash"
 echo "${name} by ${PUBLISHER}"
}
print_name
echo "Variable ${name} will not be printed because it is a local variable."

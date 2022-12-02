<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ProjectName extends Model
{
  use HasFactory;


  protected $fillable = [
     'name', 'sequence', 'required_file'
  ];


  //public $incrementing = false;


  public function projectStatuses(){
    return $this->hasMany(ProjectStatus::class, 'project_name_id', 'id');
  }

  public function projectDetails(){
    return $this->hasMany(ProjectDetail::class, 'project_name_id', 'id');
  }



  // public static function boot()
  // {
  //     parent::boot();
  //     self::creating(function ($projectName) {
  //         $projectName->id = IdGenerator::generate(['table' => 'project_names', 'length' => 5, 'prefix' => '0']);
  //     });
  // }
}
